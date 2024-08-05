import { NavigationActions, StackActions } from 'react-navigation';

let navigator;

function setTopLevelNavigator(navigatorRef) {
  navigator = navigatorRef;
}

function navigate(routeName, params) {
  if (navigator) {
    navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params,
      }),
    );

  }
}

function navActions(routeName, params) {
  return NavigationActions.navigate({ routeName: routeName, params: params })
}

function back() {
  navigator.dispatch(NavigationActions.back());
}

function pop(index) {
  navigator.dispatch(StackActions.pop({ n: index, }));
}

function popToTop(immediate = true) {
  navigator.dispatch({
    type: StackActions.POP_TO_TOP,
    immediate,
  });
}

function reset({ actions, index }) {
  const resetAction = StackActions.reset({
    index: index,
    key: null,
    actions: actions
  });
  navigator.dispatch(resetAction);
}

export default {
  navigate,
  setTopLevelNavigator,
  back,
  pop,
  popToTop,
  reset,
  navActions
};