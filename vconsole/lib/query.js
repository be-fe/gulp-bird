/**
 * DOM related Functions
 *
 * @author WechatFE
 */

import {isArray} from '../lib/tool.js';
import render from '../lib/mito.js';

const $ = {};

/**
 * get single element
 * @public
 */
$.one = function(selector, contextElement) {
  if (contextElement) {
    return contextElement.querySelector(selector);
  }
  return document.querySelector(selector);
}

/**
 * get multiple elements
 * @public
 */
$.all = function(selector, contextElement) {
  let nodeList,
    list = [];
  if (contextElement) {
    nodeList = contextElement.querySelectorAll(selector);
  } else {
    nodeList = document.querySelectorAll(selector);
  }
  if (nodeList && nodeList.length > 0) {
    list = Array.prototype.slice.call(nodeList);
  }
  return list;
}

/**
 * add className to an element
 * @public
 */
$.addClass = function($el, className) {
  if (!$el) {
    return;
  }
  if (!isArray($el)) {
    $el = [$el];
  }
  for (let i=0; i<$el.length; i++) {
    let name = $el[i].className || '',
        arr = name.split(' ');
    if (arr.indexOf(className) > -1) {
      continue;
    }
    arr.push(className);
    $el[i].className = arr.join(' ');
  }
}

/**
 * remove className from an element
 * @public
 */
$.removeClass = function($el, className) {
  if (!$el) {
    return;
  }
  if (!isArray($el)) {
    $el = [$el];
  }
  for (let i=0; i<$el.length; i++) {
    let arr = $el[i].className.split(' ');
    for (let j=0; j<arr.length; j++) {
      if (arr[j] == className) {
        arr[j] = '';
      }
    }
    $el[i].className = arr.join(' ').trim();
  }
}

/**
 * see whether an element contains a className
 * @public
 */
$.hasClass = function($el, className) {
  if (!$el) {
    return false;
  }
  let arr = $el.className.split(' ');
  for (let i=0; i<arr.length; i++) {
    if (arr[i] == className) {
      return true;
    }
  }
  return false;
}

/**
 * bind an event to element(s)
 * @public
 * @param  array    $el      element object or array
 * @param  string    eventType  name of the event
 * @param  function  fn
 * @param  boolean    useCapture
 */
$.bind = function($el, eventType, fn, useCapture) {
  if (!$el) {
    return;
  }
  if (useCapture === undefined) {
    useCapture = false;
  }
  if (!isArray($el)) {
    $el = [$el];
  }
  for (let i=0; i<$el.length; i++) {
    $el[i].addEventListener(eventType, fn, useCapture);
  }
}

/**
 * delegate an event to a parent element
 * @public
 * @param  array     $el        parent element
 * @param  string    eventType  name of the event
 * @param  string    selector   target's selector
 * @param  function  fn
 */
$.delegate = function($el, eventType, selector, fn) {
  if (!$el) { return; }
  $el.addEventListener(eventType, function(e) {
    let targets = $.all(selector, $el);
    if (!targets) {
      return;
    }
    findTarget:
    for (let i=0; i<targets.length; i++) {
      let $node = e.target;
      while ($node) {
        if ($node == targets[i]) {
          fn.call($node, e);
          break findTarget;
        }
        $node = $node.parentNode;
        if ($node == $el) {
          break;
        }
      }
    }
  }, false);
};

/**
 * simply render a HTML template
 * @param string tpl
 * @param object key-value data
 * @param boolean whether to conver to HTML string
 * @return object|string
 */
$.render = render;


/**
 * export
 */
export default $;