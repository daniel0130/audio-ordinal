export async function startInscriptionProcess(
  audionalJsonTextarea,
  inscriptionPreviewContainer,
  estimatedFeesSpan,
  networkFeeRateSpan
) {
  var audionalJsonObject = JSON.parse(audionalJsonTextarea.value);

  var inscriptionPreview = await getInscriptionPreview(audionalJsonObject);
  //   console.log(inscriptionPreview);

  var totalFees = inscriptionPreview.calculated_fee_summary.high.total_fee_sats;

  // hide audionalJsonTextarea
  audionalJsonTextarea.style.display = "none";

  // show inscriptionPreviewArea
  inscriptionPreviewContainer.style.display = "block";

  // update span with id estimatedFees to totalFees

  estimatedFeesSpan.value = totalFees;
  networkFeeRateSpan.value =
    inscriptionPreview.calculated_fee_summary.high.network_fee_rate;
}
