
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Schedules a callback to run immediately before the component is unmounted.
     *
     * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
     * only one that runs inside a server-side component.
     *
     * https://svelte.dev/docs#run-time-svelte-ondestroy
     */
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    /* src/AudioTrimmer.svelte generated by Svelte v3.59.2 */

    const { Error: Error_1, console: console_1 } = globals;
    const file$1 = "src/AudioTrimmer.svelte";

    function create_fragment$1(ctx) {
    	let h1;
    	let t1;
    	let input0;
    	let t2;
    	let button0;
    	let t4;
    	let div2;
    	let canvas0;
    	let t5;
    	let canvas1;
    	let t6;
    	let div0;
    	let t7;
    	let div1;
    	let t8;
    	let input1;
    	let t9;
    	let input2;
    	let t10;
    	let button1;
    	let t12;
    	let button2;
    	let t14;
    	let button3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Audio Trimmer";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			button0 = element("button");
    			button0.textContent = "Load Sample";
    			t4 = space();
    			div2 = element("div");
    			canvas0 = element("canvas");
    			t5 = space();
    			canvas1 = element("canvas");
    			t6 = space();
    			div0 = element("div");
    			t7 = space();
    			div1 = element("div");
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			input2 = element("input");
    			t10 = space();
    			button1 = element("button");
    			button1.textContent = "Play";
    			t12 = space();
    			button2 = element("button");
    			button2.textContent = "Stop";
    			t14 = space();
    			button3 = element("button");
    			button3.textContent = "Loop Selection";
    			add_location(h1, file$1, 256, 0, 7605);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Enter Ordinal ID");
    			add_location(input0, file$1, 257, 0, 7628);
    			add_location(button0, file$1, 258, 0, 7704);
    			attr_dev(canvas0, "width", "4000");
    			attr_dev(canvas0, "height", "800");
    			attr_dev(canvas0, "class", "waveform-canvas svelte-14j8dif");
    			add_location(canvas0, file$1, 261, 4, 7793);
    			attr_dev(canvas1, "width", "4000");
    			attr_dev(canvas1, "height", "800");
    			attr_dev(canvas1, "class", "playback-canvas svelte-14j8dif");
    			add_location(canvas1, file$1, 262, 4, 7884);
    			attr_dev(div0, "class", "dimmed svelte-14j8dif");
    			set_style(div0, "width", /*startDimmedWidth*/ ctx[4]);
    			set_style(div0, "left", "0");
    			add_location(div0, file$1, 263, 4, 7983);
    			attr_dev(div1, "class", "dimmed svelte-14j8dif");
    			set_style(div1, "width", /*endDimmedWidth*/ ctx[5]);
    			set_style(div1, "right", "0");
    			set_style(div1, "left", "auto");
    			add_location(div1, file$1, 264, 4, 8058);
    			attr_dev(div2, "class", "waveform-container svelte-14j8dif");
    			add_location(div2, file$1, 260, 0, 7756);
    			attr_dev(input1, "type", "range");
    			attr_dev(input1, "class", "slider svelte-14j8dif");
    			attr_dev(input1, "min", "0");
    			attr_dev(input1, "max", /*maxDuration*/ ctx[0]);
    			attr_dev(input1, "step", "0.01");
    			add_location(input1, file$1, 267, 0, 8148);
    			attr_dev(input2, "type", "range");
    			attr_dev(input2, "class", "slider svelte-14j8dif");
    			attr_dev(input2, "min", "0");
    			attr_dev(input2, "max", /*maxDuration*/ ctx[0]);
    			attr_dev(input2, "step", "0.01");
    			add_location(input2, file$1, 268, 0, 8254);
    			add_location(button1, file$1, 270, 0, 8359);
    			add_location(button2, file$1, 271, 0, 8402);
    			attr_dev(button3, "class", "loop-button svelte-14j8dif");
    			toggle_class(button3, "off", !/*isLooping*/ ctx[6]);
    			toggle_class(button3, "on", /*isLooping*/ ctx[6]);
    			add_location(button3, file$1, 273, 0, 8446);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input0, anchor);
    			set_input_value(input0, /*ordinalId*/ ctx[3]);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, canvas0);
    			/*canvas0_binding*/ ctx[20](canvas0);
    			append_dev(div2, t5);
    			append_dev(div2, canvas1);
    			/*canvas1_binding*/ ctx[21](canvas1);
    			append_dev(div2, t6);
    			append_dev(div2, div0);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, input1, anchor);
    			set_input_value(input1, /*$startSliderValue*/ ctx[2]);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, input2, anchor);
    			set_input_value(input2, /*$endSliderValue*/ ctx[1]);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, button1, anchor);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, button2, anchor);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, button3, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[19]),
    					listen_dev(button0, "click", /*loadSample*/ ctx[11], false, false, false, false),
    					listen_dev(input1, "change", /*input1_change_input_handler*/ ctx[22]),
    					listen_dev(input1, "input", /*input1_change_input_handler*/ ctx[22]),
    					listen_dev(input2, "change", /*input2_change_input_handler*/ ctx[23]),
    					listen_dev(input2, "input", /*input2_change_input_handler*/ ctx[23]),
    					listen_dev(button1, "click", /*playAudio*/ ctx[13], false, false, false, false),
    					listen_dev(button2, "click", /*stopAudio*/ ctx[14], false, false, false, false),
    					listen_dev(button3, "click", /*toggleLoop*/ ctx[12], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*ordinalId*/ 8 && input0.value !== /*ordinalId*/ ctx[3]) {
    				set_input_value(input0, /*ordinalId*/ ctx[3]);
    			}

    			if (dirty[0] & /*startDimmedWidth*/ 16) {
    				set_style(div0, "width", /*startDimmedWidth*/ ctx[4]);
    			}

    			if (dirty[0] & /*endDimmedWidth*/ 32) {
    				set_style(div1, "width", /*endDimmedWidth*/ ctx[5]);
    			}

    			if (dirty[0] & /*maxDuration*/ 1) {
    				attr_dev(input1, "max", /*maxDuration*/ ctx[0]);
    			}

    			if (dirty[0] & /*$startSliderValue*/ 4) {
    				set_input_value(input1, /*$startSliderValue*/ ctx[2]);
    			}

    			if (dirty[0] & /*maxDuration*/ 1) {
    				attr_dev(input2, "max", /*maxDuration*/ ctx[0]);
    			}

    			if (dirty[0] & /*$endSliderValue*/ 2) {
    				set_input_value(input2, /*$endSliderValue*/ ctx[1]);
    			}

    			if (dirty[0] & /*isLooping*/ 64) {
    				toggle_class(button3, "off", !/*isLooping*/ ctx[6]);
    			}

    			if (dirty[0] & /*isLooping*/ 64) {
    				toggle_class(button3, "on", /*isLooping*/ ctx[6]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div2);
    			/*canvas0_binding*/ ctx[20](null);
    			/*canvas1_binding*/ ctx[21](null);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(input1);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(input2);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(button1);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(button2);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(button3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function base64ToArrayBuffer(base64) {
    	const binaryString = atob(base64);
    	const bytes = new Uint8Array(binaryString.length);

    	for (let i = 0; i < binaryString.length; i++) {
    		bytes[i] = binaryString.charCodeAt(i);
    	}

    	return bytes.buffer;
    }

    function getMinMax(channelData, startIndex, step) {
    	let min = 1.0, max = -1.0;

    	for (let i = 0; i < step; i++) {
    		const datum = channelData[startIndex + i];
    		if (datum < min) min = datum;
    		if (datum > max) max = datum;
    	}

    	return { min, max };
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $endSliderValue;
    	let $startSliderValue;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AudioTrimmer', slots, []);
    	let { externalOrdinalId = '' } = $$props;
    	let { externalAudioContext } = $$props;
    	let { channelIndex } = $$props;

    	// In your Svelte component
function storeTrimSettings() {
    console.log(`Storing trim settings for channel ${channelIndex}`);
    window.trimSettings.update({
        [channelIndex]: {
            start: $startSliderValue,
            end: $endSliderValue
        }
    });
    console.log(`Trim settings stored successfully for channel ${channelIndex}`);
}

    	// Use the external AudioContext if provided, otherwise create a new one
    	let audioContext = externalAudioContext || new (window.AudioContext || window.webkitAudioContext)();

    	let audioBuffer;
    	let sourceNode;
    	let startTime;
    	let isPlaying = false;
    	let ordinalId = '';
    	let startDimmedWidth = '0%';
    	let endDimmedWidth = '0%';
    	let maxDuration = 0;
		const startSliderValue = writable(0.01);
		validate_store(startSliderValue, 'startSliderValue');
		component_subscribe($$self, startSliderValue, value => $$invalidate(2, $startSliderValue = value));
		const endSliderValue = writable(100);
		validate_store(endSliderValue, 'endSliderValue');
		component_subscribe($$self, endSliderValue, value => $$invalidate(1, $endSliderValue = value));
		const loopEnabled = writable(false);
		let isLooping = false;
		let canvas, playbackCanvas, ctx, playbackCtx;
		let shouldSaveSettings = false;

		// Reactive block for updating dimmed areas and saving settings
		$: if (audioBuffer) {
			maxDuration = audioBuffer.duration;
			startDimmedWidth = `${Math.max(0, $startSliderValue / maxDuration) * 100}%`;
			endDimmedWidth = `${Math.max(0, (1 - $endSliderValue / maxDuration)) * 100}%`;
			console.log(`Start dimmed width: ${startDimmedWidth}, End dimmed width: ${endDimmedWidth}`);

			if (shouldSaveSettings) {
				storeTrimSettings();
			}
		}

		// Reactive block for handling slider value changes
		$: if (shouldSaveSettings && maxDuration > 0) {
			startDimmedWidth = `${Math.max(0, $startSliderValue / maxDuration) * 100}%`;
			endDimmedWidth = `${Math.max(0, (1 - $endSliderValue / maxDuration)) * 100}%`;
			storeTrimSettings();
		}


		onMount(() => {
			ctx = canvas.getContext('2d');
			playbackCtx = playbackCanvas.getContext('2d');
		
			// Check for saved trim settings in local storage
			const savedTrimSettings = getTrimSettings(channelIndex);
			if (savedTrimSettings) {
				console.log(`Retrieved trim settings for channel ${channelIndex}:`, savedTrimSettings);
				startSliderValue.set(savedTrimSettings.start);
				endSliderValue.set(savedTrimSettings.end);
		
				// Update dimmed widths based on saved settings
				if (audioBuffer) {
					maxDuration = audioBuffer.duration;
					startDimmedWidth = `${Math.max(0, savedTrimSettings.start / maxDuration) * 100}%`;
					endDimmedWidth = `${Math.max(0, (1 - savedTrimSettings.end / maxDuration)) * 100}%`;
				}
				shouldSaveSettings = true;
			} else {
				console.log(`No saved trim settings found for channel ${channelIndex}`);
			}
		});
		

    	onDestroy(() => {
    		if (sourceNode) {
    			sourceNode.disconnect();
    		}

    		audioContext.close();
    	});

    	function decodeAudioData(audioData) {
    		return new Promise((resolve, reject) => {
    				audioContext.decodeAudioData(audioData, resolve, e => reject(new Error(`Decoding audio data failed with error: ${e}`)));
    			});
    	}

    	async function fetchAudio(ordinalId) {
    		const url = `https://ordinals.com/content/${ordinalId}`;

    		try {
    			const response = await fetch(url);
    			const contentType = response.headers.get('content-type');
    			let arrayBuffer;

    			if (contentType && contentType.includes('application/json')) {
    				const jsonData = await response.json();

    				if (!jsonData.audioData) {
    					throw new Error("No audioData field in JSON response");
    				}

    				const base64Audio = jsonData.audioData.split(',')[1];
    				arrayBuffer = base64ToArrayBuffer(base64Audio);
    			} else {
    				arrayBuffer = await response.arrayBuffer();
    			}

    			$$invalidate(18, audioBuffer = await decodeAudioData(arrayBuffer));
    			// Only set default values if no saved settings are found
				const savedTrimSettings = getTrimSettings(channelIndex);
				if (!savedTrimSettings) {
					startSliderValue.set(0);
					endSliderValue.set(audioBuffer.duration);
				}
				drawWaveform();
    		} catch(error) {
    			console.error('Error fetching or decoding audio:', error);
    		}
    	}

    	function loadSample() {
    		const idToUse = externalOrdinalId || ordinalId;

    		if (idToUse) {
    			fetchAudio(idToUse);
    		}
    	}

    	function drawWaveform() {
    		if (!audioBuffer) return;
    		const width = canvas.width;
    		const height = canvas.height;
    		const channelData = audioBuffer.getChannelData(0);
    		const step = Math.ceil(channelData.length / width);
    		const amp = height / 2;
    		ctx.clearRect(0, 0, width, height);
    		ctx.beginPath();

    		for (let i = 0; i < width; i++) {
    			const { min, max } = getMinMax(channelData, i * step, step);
    			ctx.moveTo(i, amp * (1 + min));
    			ctx.lineTo(i, amp * (1 + max));
    		}

    		ctx.stroke();
    	}

    	function toggleLoop() {
    		$$invalidate(6, isLooping = !isLooping);
    	}

    	function playAudio() {
    		sourceNode = audioContext.createBufferSource();
    		sourceNode.buffer = audioBuffer;
    		sourceNode.connect(audioContext.destination);
    		const startValue = $startSliderValue;
    		const endValue = $endSliderValue;
    		sourceNode.loop = isLooping;

    		if (isLooping) {
    			sourceNode.loopStart = Math.max(0, startValue);
    			sourceNode.loopEnd = Math.min(endValue, audioBuffer.duration);
    		}

    		if (audioBuffer && startValue < endValue) {
    			sourceNode.start(0, startValue, endValue - startValue);
    			startTime = audioContext.currentTime - startValue;
    			isPlaying = true;
    			animatePlayback();
    		}

    		sourceNode.onended = () => {
    			isPlaying = false;
    			if (isLooping) playAudio();
    		};
    	}

    	function stopAudio() {
    		if (isPlaying && sourceNode) {
    			sourceNode.disconnect();
    			sourceNode = null;
    			isPlaying = false;
    		}

    		$$invalidate(6, isLooping = false);
    	}

    	function getCurrentPlaybackPosition() {
    		if (!isPlaying) return 0;
    		return (audioContext.currentTime - startTime) % audioBuffer.duration;
    	}

    	function updatePlaybackCanvas() {
    		const currentPosition = getCurrentPlaybackPosition();
    		const width = playbackCanvas.width;
    		const height = playbackCanvas.height;
    		playbackCtx.clearRect(0, 0, width, height);
    		const xPosition = currentPosition / audioBuffer.duration * width;
    		playbackCtx.beginPath();
    		playbackCtx.moveTo(xPosition, 0);
    		playbackCtx.lineTo(xPosition, height);
    		playbackCtx.strokeStyle = '#FF0000';
    		playbackCtx.lineWidth = 2;
    		playbackCtx.stroke();
    	}

    	function animatePlayback() {
    		if (isPlaying) {
    			updatePlaybackCanvas();
    			requestAnimationFrame(animatePlayback);
    		}
    	}

    	$$self.$$.on_mount.push(function () {
    		if (externalAudioContext === undefined && !('externalAudioContext' in $$props || $$self.$$.bound[$$self.$$.props['externalAudioContext']])) {
    			console_1.warn("<AudioTrimmer> was created without expected prop 'externalAudioContext'");
    		}

    		if (channelIndex === undefined && !('channelIndex' in $$props || $$self.$$.bound[$$self.$$.props['channelIndex']])) {
    			console_1.warn("<AudioTrimmer> was created without expected prop 'channelIndex'");
    		}
    	});

    	const writable_props = ['externalOrdinalId', 'externalAudioContext', 'channelIndex'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<AudioTrimmer> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		ordinalId = this.value;
    		$$invalidate(3, ordinalId);
    	}

    	function canvas0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			canvas = $$value;
    			$$invalidate(7, canvas);
    		});
    	}

    	function canvas1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			playbackCanvas = $$value;
    			$$invalidate(8, playbackCanvas);
    		});
    	}

    	function input1_change_input_handler() {
			$startSliderValue = to_number(this.value);
			startSliderValue.set($startSliderValue);
			console.log(`Saving start trim setting for channel ${channelIndex}:`, $startSliderValue);
			saveTrimSettings(channelIndex, { start: $startSliderValue, end: $endSliderValue });
		}
		
		function input2_change_input_handler() {
			$endSliderValue = to_number(this.value);
			endSliderValue.set($endSliderValue);
			console.log(`Saving end trim setting for channel ${channelIndex}:`, $endSliderValue);
			saveTrimSettings(channelIndex, { start: $startSliderValue, end: $endSliderValue });
		}
		
		

    	$$self.$$set = $$props => {
    		if ('externalOrdinalId' in $$props) $$invalidate(15, externalOrdinalId = $$props.externalOrdinalId);
    		if ('externalAudioContext' in $$props) $$invalidate(16, externalAudioContext = $$props.externalAudioContext);
    		if ('channelIndex' in $$props) $$invalidate(17, channelIndex = $$props.channelIndex);
    	};

    	$$self.$capture_state = () => ({
    		externalOrdinalId,
    		externalAudioContext,
    		channelIndex,
    		onMount,
    		onDestroy,
    		writable,
    		trimSettings,
    		storeTrimSettings,
    		audioContext,
    		audioBuffer,
    		sourceNode,
    		startTime,
    		isPlaying,
    		ordinalId,
    		startDimmedWidth,
    		endDimmedWidth,
    		maxDuration,
    		startSliderValue,
    		endSliderValue,
    		loopEnabled,
    		isLooping,
    		canvas,
    		playbackCanvas,
    		ctx,
    		playbackCtx,
    		base64ToArrayBuffer,
    		decodeAudioData,
    		fetchAudio,
    		loadSample,
    		drawWaveform,
    		toggleLoop,
    		playAudio,
    		stopAudio,
    		getMinMax,
    		getCurrentPlaybackPosition,
    		updatePlaybackCanvas,
    		animatePlayback,
    		$endSliderValue,
    		$startSliderValue
    	});

    	$$self.$inject_state = $$props => {
    		if ('externalOrdinalId' in $$props) $$invalidate(15, externalOrdinalId = $$props.externalOrdinalId);
    		if ('externalAudioContext' in $$props) $$invalidate(16, externalAudioContext = $$props.externalAudioContext);
    		if ('channelIndex' in $$props) $$invalidate(17, channelIndex = $$props.channelIndex);
    		if ('audioContext' in $$props) audioContext = $$props.audioContext;
    		if ('audioBuffer' in $$props) $$invalidate(18, audioBuffer = $$props.audioBuffer);
    		if ('sourceNode' in $$props) sourceNode = $$props.sourceNode;
    		if ('startTime' in $$props) startTime = $$props.startTime;
    		if ('isPlaying' in $$props) isPlaying = $$props.isPlaying;
    		if ('ordinalId' in $$props) $$invalidate(3, ordinalId = $$props.ordinalId);
    		if ('startDimmedWidth' in $$props) $$invalidate(4, startDimmedWidth = $$props.startDimmedWidth);
    		if ('endDimmedWidth' in $$props) $$invalidate(5, endDimmedWidth = $$props.endDimmedWidth);
    		if ('maxDuration' in $$props) $$invalidate(0, maxDuration = $$props.maxDuration);
    		if ('isLooping' in $$props) $$invalidate(6, isLooping = $$props.isLooping);
    		if ('canvas' in $$props) $$invalidate(7, canvas = $$props.canvas);
    		if ('playbackCanvas' in $$props) $$invalidate(8, playbackCanvas = $$props.playbackCanvas);
    		if ('ctx' in $$props) ctx = $$props.ctx;
    		if ('playbackCtx' in $$props) playbackCtx = $$props.playbackCtx;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*audioBuffer, $startSliderValue, maxDuration, $endSliderValue*/ 262151) {
    			if (audioBuffer) {
    				$$invalidate(0, maxDuration = audioBuffer.duration);
    				$$invalidate(4, startDimmedWidth = `${Math.max(0, $startSliderValue / maxDuration) * 100}%`);
    				$$invalidate(5, endDimmedWidth = `${Math.max(0, 1 - $endSliderValue / maxDuration) * 100}%`);

    				if ($startSliderValue >= $endSliderValue) {
    					startSliderValue.set($endSliderValue - 0.01);
    				}

    				if ($endSliderValue <= $startSliderValue) {
    					endSliderValue.set($startSliderValue + 0.01);
    				}

    				if ($startSliderValue !== undefined && $endSliderValue !== undefined) {
    					storeTrimSettings();
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*externalOrdinalId*/ 32768) {
    			if (externalOrdinalId) {
    				fetchAudio(externalOrdinalId);
    			}
    		}
    	};

    	return [
    		maxDuration,
    		$endSliderValue,
    		$startSliderValue,
    		ordinalId,
    		startDimmedWidth,
    		endDimmedWidth,
    		isLooping,
    		canvas,
    		playbackCanvas,
    		startSliderValue,
    		endSliderValue,
    		loadSample,
    		toggleLoop,
    		playAudio,
    		stopAudio,
    		externalOrdinalId,
    		externalAudioContext,
    		channelIndex,
    		audioBuffer,
    		input0_input_handler,
    		canvas0_binding,
    		canvas1_binding,
    		input1_change_input_handler,
    		input2_change_input_handler
    	];
    }

	window.AudioTrimmer = class extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$1,
    			create_fragment$1,
    			safe_not_equal,
    			{
    				externalOrdinalId: 15,
    				externalAudioContext: 16,
    				channelIndex: 17
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AudioTrimmer",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get externalOrdinalId() {
    		throw new Error_1("<AudioTrimmer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set externalOrdinalId(value) {
    		throw new Error_1("<AudioTrimmer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get externalAudioContext() {
    		throw new Error_1("<AudioTrimmer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set externalAudioContext(value) {
    		throw new Error_1("<AudioTrimmer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get channelIndex() {
    		throw new Error_1("<AudioTrimmer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set channelIndex(value) {
    		throw new Error_1("<AudioTrimmer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let audiotrimmer;
    	let current;
    	audiotrimmer = new AudioTrimmer({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(audiotrimmer.$$.fragment);
    			add_location(main, file, 4, 2, 77);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(audiotrimmer, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(audiotrimmer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(audiotrimmer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(audiotrimmer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ AudioTrimmer });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
