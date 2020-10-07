/**
 * Function to mask clouds based on the pixel_qa band of Landsat 8 SR data.
 * @param {ee.Image} image input Landsat 8 SR image
 * @return {ee.Image} cloudmasked Landsat 8 image
 */
function maskL8sr(image) {
  // Bits 3 and 5 are cloud shadow and cloud, respectively.
  var cloudShadowBitMask = (1 << 3);
  var cloudsBitMask = (1 << 5);
  // Get the pixel QA band.
  var qa = image.select('pixel_qa');
  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
                 .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
  return image.updateMask(mask);
}

var dataset = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
                  .filterDate('2016-01-01', '2016-12-31')
                  .median();

var visParams = {
  bands: ['B2'],
  min: 0,
  max: 3000,
  gamma: 1.4,
};
var geometry = ee.Geometry.Rectangle([20, 94, 20.2, 94.2]);
Map.setCenter(114.0079, -26.0765, 9);
Map.addLayer(dataset, visParams);

Export.image.toDrive({
  image: dataset,
  description: 'landsatTest',
  folder: "Deforestation Modelling",
  fileNamePrefix: "landsatMasked",
  scale: 30,
  region: geometry,
  maxPixels: 5000000,
  fileFormat: "GeoTIFF"
});


