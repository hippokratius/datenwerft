/**
 * @function
 * @name getFeatureGeometryLatLng
 *
 * returns center of passed GeoJSON feature geometry
 *
 * @param {Object} featureGeometry - GeoJSON feature geometry
 * @returns {Array} - center (i.e. array with x and y coordinates) of passed GeoJSON feature
 */
function getFeatureGeometryLatLng(featureGeometry) {
  let x = 0, y = 0;
  if (featureGeometry.type === 'Point') {
    x = featureGeometry.coordinates[0];
    y = featureGeometry.coordinates[1];
  } else if (typeof featureGeometry.coordinates !== 'undefined') {
    x = featureGeometry.coordinates[0][1][0] + ((featureGeometry.coordinates[0][0][0] - featureGeometry.coordinates[0][1][0]) / 2);
    y = featureGeometry.coordinates[0][0][1] + ((featureGeometry.coordinates[0][2][1] - featureGeometry.coordinates[0][0][1]) / 2);
  }
  return [y, x];
}

/**
 * @function
 * @name interchangeRecursive
 *
 * recursively reverses the order of x and y coordinates in passed array and returns it
 *
 * @param {Array} arr - array with x and y coordinates
 * @param {boolean} [polygon=false] - is it a polygon?
 * @returns {Array} - array with x and y coordinates in reverse order
 */
function interchangeRecursive(arr, polygon = false) {
  // one-dimensional array
  if (typeof arr[0] === 'number') {
    let lat = arr[1];
    let lng = arr[0];
    arr[0] = lat;
    arr[1] = lng;
    return arr;
  // multi-dimensional array
  } else if (Array.isArray(arr[0])) {
    for (let i = 0; i < arr.length; i++) {
      // for polygons, the first and last x-y coordinate pairs are the same:
      // therefore leave out the last x-y coordinate pair here!
      if (polygon === true && i === (arr.length - 1) && typeof arr[i][0] === 'number') {
        continue;
      }
      arr[i] = interchangeRecursive(arr[i], polygon);
    }
    return arr;
  }
}

/**
 * @function
 * @name refreshModal
 *
 * refreshes contents of passed Bootstrap modal and returns it
 *
 * @param {Object} modal - Bootstrap modal
 * @param {string} [title=''] - titel of the Bootstrap modal
 * @param {string} [body=''] - body of the Bootstrap modal
 * @param {Boolean} [addFooter=false] - add a footer to the Bootstrap modal?
 * @returns {Object} - Bootstrap modal with refreshd contents
 */
function refreshModal(modal, title = '', body = '', addFooter = false) {
  modal.find('.modal-title').text(title);
  if (modal.find('#loading-modal-body-text').length > 0)
    modal.find('#loading-modal-body-text').text(body);
  else
    modal.find('.modal-body').text(body);
  if (addFooter === true) {
    modal.find('.spinner-border').remove();
    modal.find('.modal-body').after(
      '<div class="modal-footer">' +
        '<button class="btn btn-primary" type="button" data-bs-dismiss="modal">OK</button>' +
      '</div>'
    );
  }
  return modal;
}

/**
 * @function
 * @name toggleModal
 *
 * toggles visibility of passed Bootstrap modal
 *
 * @param {Object} modal - Bootstrap modal
 * @param {string} [title=''] - titel of the Bootstrap modal
 * @param {string} [body=''] - body of the Bootstrap modal
 * @param {string} [customLoadingContent=null] - additional content for loading view
 */
function toggleModal(modal, title = '', body = '', customLoadingContent = '') {
  if (title || body)
    refreshModal(modal, title, body);
  if (customLoadingContent)
    modal.find(customLoadingContent).prop('hidden', false);
  modal.modal('toggle');
}
