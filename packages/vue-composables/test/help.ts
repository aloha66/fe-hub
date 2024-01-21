import { mount } from '@vue/test-utils'

export function useSetup(setup: () => void) {
  const Comp = {
    setup,
    render() {},
  }

  const wrapper = mount(Comp)

  return {
    wrapper,
    // router: wrapper.router,
  }
}
