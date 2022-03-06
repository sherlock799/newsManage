export function LoadingReducer(state={
  isLoading:false
}, action) {
  let newstate={...state}
  switch (action.type) {
    case 'change_loading':
      newstate.isLoading=action.payload
      return newstate
    default:
      return state
  }
}