require('babelify/polyfill');
import {load, mapToCanvas, createImage} from './lib/image';
import {invoker} from './lib/functions';
import {dataUrl as mapToDataUrl} from './lib/canvas';
import {blob as mapToBlob} from './lib/blob';
import * as position from './lib/position';

/**
 * Return a watermark object.
 *
 * @param {Array} resources - a collection of urls and File objects
 * @param {Function} init - an initialization function that is given Image objects before loading (only applies if resources is a collection of urls)
 * @param {Promise} promise - optional
 * @return {Object}
 */
export function watermark(resources, init, promise) {

  return {

    /**
     * Convert the watermarked image into a dataUrl. The draw
     * function is given all images as canvas elements in order.
     *
     * @param {Function} draw
     * @return {Object}
     */
    dataUrl(draw) {
      let promise = load(resources, init)
        .then(mapToCanvas)
        .then(invoker(draw))
        .then(mapToDataUrl);

      return new watermark(resources, init, promise);
    },

    /**
     * Convert the watermark into a blob.
     *
     * @param {Function} draw
     * @return {Object}
     */
    blob(draw) {
      let promise = this.dataUrl(draw)
        .then(mapToBlob);

      return watermark(resources, init, promise);
    },

    /**
     * Convert the watermark into an image
     */
    image(draw) {
      let promise = this.dataUrl(draw)
        .then(createImage);

      return watermark(resources, init, promise);
    },

    /**
     * Delegate to the watermark promise.
     *
     * @return {Promise}
     */
    then(...funcs) {
      return promise.then.apply(promise, funcs);
    }

  };
};

/**
 * Utility functions
 */
watermark.position = position;

/**
 * Export to browser
 */
window.watermark = watermark;
