export function CollapsedReducer(state={
  isCollapsed:false
}, action) {
  let newstate={...state}
  switch (action.type) {
    case 'change_collapsed':
      newstate.isCollapsed=!newstate.isCollapsed
      return newstate
    default:
      return state
  }
}