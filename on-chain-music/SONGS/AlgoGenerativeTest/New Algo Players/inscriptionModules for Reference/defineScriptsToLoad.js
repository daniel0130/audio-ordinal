// defineScriptsToLoad.js

  // Utility function to prepend the base URL
  const prependBaseURL = (baseURL, ids) => ids.map(id => `${baseURL}${id}`);
    
  // Array of script IDs to load
  const scriptIds = [
      "61895db1f0d62d24cea96570e66b92435a8a4979e3d3fef8041680ed2afeddc8i0", // audioContextManager.js
      "1b036f9d60a04f0612af8c53753273f66339e69d7843138007eb3573703b1218i0", // jsonLoader.js
      "150e020d5e6ea8b53b7b3d2160f25f65c2e550d413f9c53d9e1cfb101d6914f2i0", // audioProcessing.js
      "935828577e4762caaf32b76a0f74cb4f37bdcdbdae1d27a7c93d000d5cfe9d28i0", // playBuffer
      "bab2b37e0abcce41d784d65d94a5c3c266228c2d8bd3ecdee4fba7986f5a042ei0", // visualiserMessaging
      "1a5cafb61e4a320434fc4087e203d2a5f695ba9112635b960fc9d7dcb961d9fci0", // startPlaybackLoop
      "a3d8a40fcde6935f16b49ad7c9e9aa185f01d1618f4e35828415f6cc27377a47i0", // dispatchSequenceEvents
      "17c6cb4f92d47043da52ce8334c41961c588b7955488e56f08264840ef63a4eei0", // initialiseWorker
      // "4915e144695ab04171092a45e2d49cfa7b5e92c9a35ce612e7b749457acc92ddi0", // titleDisplays_2.js
      "3ab9dda407f9c7f62b46401e2664bc1496247c8950620a11a36a8601267cb42fi0", // colourPalette.js
      "4a6164e05aee1d4ed77585bc85e4d4530801ef71e1c277c868ce374c4a7b9902i0", // colourSettingsaMaster
      "0505ae5cebbe9513648fc8e4ecee22d9969764f3cdac9cd6ec33be083c77ae96i0", // colourSettingsLevel0.js
      "87bb49f5617a241e29512850176e53169c3da4a76444d5d8fcd6c1e41489a4b3i0", // colourSettingsLevel1 
      "cea34b6ad754f3a4e992976125bbd1dd59213aab3de03c9fe2eb10ddbe387f76i0", // colourSettingsLevel2
      "bcee9a2e880510772f0129c735a4ecea5bb45277f3b99ff640c1bd393dddd6dfi0", // colourSettingsLevel3
      "90d910fe4088c53a16eb227ec2fe59802091dc4ea51564b2665090403c34f59ci0", // colourSettingsLevel4
      "916fd1731cdecf82706a290d03448c6dc505c01d6ec44bbca20281a19723d617i0", // colourSettingsLevel5
      "6a5e5c8b42793dd35512dfddd81dbbe211f052ac79839dd54b53461f5783a390i0", // colourSettingsLevel6
      "c0ee69121238f6438be8398038301cf5b1d876cce30a0d45a3a5e0b927826940i0", // colourSettingsLevel7
      "6f1def70a3290c50793773a8b1712c9a1b0561b3674ee50a06c13bc4e492f459i0", // colourSettingsLevel8
      "c7c92a81d5279950be7d0bd3e755ad620551bc65e6e514d6f7c29b4c24465d0ai0", // initVisualiser.js
      "99ecc0668e27f03cf202f9ebc49d0332ac8f594bc9b5483969108b83723a0e9di0", // visualiserLogging.js
      "305829e076d38130be65851c79241929983f16d679822015ff237029f67d5d9ei0", // visualiserMessageHandling_minified.js
      "0d8309856ec04e8ab5bd6aa4689429102378fb45368ad0e2787f0dfc72c66152i0", // visualiserWorkers.js
      "287c837ecffc5b80d8e3c92c22b6dbf0447a3d916b95ee314c66909f6f2b2f3ci0", // visualiserGeometry.js
      "214457a4f832847565746ecb0b9460ec7dc8ad93549a00a69f18b3d492c0e005i0", // visualiserDrawingColours.js
      "97c042112c29d9a9ca1da99890542befdbffaec6ff17798897c187a617a62f79i0" // PFP module
  ];

  // Define the base URL
  const baseURL = "/content/";

  // Prepend the base URL to each script ID
  window.scriptsToLoad = prependBaseURL(baseURL, scriptIds);