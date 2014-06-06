describe('angular-gs-flash-message', function () {
  beforeEach(module('gs.flash-message'));

  var $scope, el;

  beforeEach(inject(function ($rootScope, $compile) {
    $scope = $rootScope.$new();
    el = $compile('<div gs-flash-message="gabe"></div>')($scope);
  }));

  it('displays success messages on broadcast', function () {
    var flashMessage, text = 'lel';

    $scope.$apply(function () {
      $scope.$broadcast('flash:gabe', {success: text});
    });

    flashMessage = el.children().children();

    expect(flashMessage.hasClass('alert--message__success')).toBeTruthy();
    expect(flashMessage.text()).toBe(text);
  });

  it('displays error messages on broadcast', function () {
    var flashMessage, text = 'lel';

    $scope.$apply(function () {
      $scope.$broadcast('flash:gabe', {error: text});
    });

    flashMessage = el.children().children();

    expect(flashMessage.hasClass('alert--message__error')).toBeTruthy();
    expect(flashMessage.text()).toBe(text);
  });

  it('hides all messages on stateChangeSuccess', function () {
    var text = 'lel';

    $scope.$apply(function () {
      $scope.$broadcast('flash:gabe', {error: text});
      $scope.$broadcast('$stateChangeSuccess', {}, {}, {}, {});
    });

    expect(el.text()).toBe('');
  });

  it('sets messages on stateChangeSuccess', function () {
    var flashMessage,
      text = 'lel',
      params = {
        flash: {
          gabe: {
            success: text
          }
        }
      };

    $scope.$apply(function () {
      $scope.$broadcast('$stateChangeSuccess', {}, {}, {}, params);
    });

    flashMessage = el.children().children();

    expect(flashMessage.hasClass('alert--message__success')).toBeTruthy();
    expect(el.text()).toBe('lel');
  });

});
