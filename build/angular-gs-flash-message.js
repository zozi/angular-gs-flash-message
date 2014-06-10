(function(window, angular, undefined) {'use strict';

angular.module('gs.flash-message', [])
.directive('gsFlashMessage', function () {

  function _messageWrapper (messages) {
    messages = messages || {};
    messages.success = messages.success || '';
    messages.error = messages.error || '';

    return messages;
  }

  function _relevantFlashMessages (params, key) {
    return params.flash && params.flash[key];
  }

  return {
    restrict: 'A',
    scope: true,
    template:
      '<div class="alert" ng-if="messages.error.length || messages.success.length">' +
        '<div ng-if="messages.error.length" class="alert--message alert--message__error">' +
          '<span class="alert--message--content" ng-bind="messages.error"></span>' +
          '<a href="javascript:;" ng-click="close()">' +
            '<i class="alert--message--remove-icon"></i>' +
          '</a>' +
        '</div>' +
        '<div ng-if="messages.success.length" class="alert--message alert--message__success">' +
          '<span class="alert--message--content" ng-bind="messages.success"></span>' +
          '<a href="javascript:;" ng-click="close()">' +
            '<i class="alert--message--remove-icon"></i>' +
          '</a>' +
        '</div>' +
      '</div>',
    link: function (scope, el, attrs) {
      var key = (attrs.gsFlashMessage || attrs.dataGsFlashMessage);
      if (!key.length) {
        return;
      }

      angular.extend(scope, {messages: _messageWrapper({})});

      scope.$on('$stateChangeSuccess', function (ev, toS, toP, fromS, fromP) {
        var messages = _relevantFlashMessages(fromP, key);
        if (messages) {
          scope.messages = _messageWrapper(messages);
        } else {
          scope.close();
        }
        return scope.messages;
      });

      scope.$on('flash:' + key, function (ev, messages) {
        scope.messages = _messageWrapper(messages);
        return scope.messages;
      });

      scope.close = function () {
        scope.messages = _messageWrapper({});
        return scope.messages;
      };
    }
  };
});

})(window, window.angular);
