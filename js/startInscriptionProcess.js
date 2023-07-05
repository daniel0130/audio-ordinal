export async function startInscriptionProcess(
  audionalJsonText,
  inscriptionPreviewContainer,
  estimatedFeesSpan,
  networkFeeRateSpan
) {
  var audionalJsonObject = JSON.parse(audionalJsonText.innerText);

  var inscriptionPreview = await getInscriptionPreview(audionalJsonObject);

  var totalFees = inscriptionPreview.calculated_fee_summary.high.total_fee_sats;

  // hide audionalJsonTextarea
  audionalJsonText.style.display = "none";

  // show inscriptionPreviewArea
  inscriptionPreviewContainer.style.display = "block";

  // update span with id estimatedFees to totalFees
  estimatedFeesSpan.value = totalFees;
  networkFeeRateSpan.value =
    inscriptionPreview.calculated_fee_summary.high.network_fee_rate;

  // get doInscribe button and display it
  var doInscribeButton = document.getElementById("doInscribe");
  doInscribeButton.style.display = "inline-block";
}