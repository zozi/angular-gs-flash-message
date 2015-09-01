(function(window, angular, undefined) {'use strict';

angular.module('gs.flash-message', ['ngSanitize'])
.directive('gsFlashMessage', ['$sce', function ($sce) {

  function _messageWrapper (messages) {
    messages = messages || {};
    _.forEach(Object.keys(messages), function (key) {
      messages[key] = (_.isArray(messages[key])
                        ? messages[key]
                        : (_.isString(messages[key])
                          ? [$sce.trustAsHtml(messages[key])]
                          : []));
    });
    return messages;
  }

  function _relevantFlashMessages (params, key) {
    return params.flash && params.flash[key];
  }

  return {
    restrict: 'A',
    scope: true,
    template:
      '<div class="alert" ng-if="flashMessagesPopulated()">' +
        '<div ng-if="messageList.length" ng-repeat="(key, messageList) in messages" class="alert--message alert--message__{{ key }}"">' +
          '<span class="alert--message--content" ng-repeat="message in messageList track by $index" ng-bind-html="message"></span>' +
          '<a href ng-click="close()">' +
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

      scope.flashMessagesPopulated = function () {
        return _.any(scope.messages, 'length');
      };
    }
  };
}]);

})(window, window.angular);
