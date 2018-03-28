import { Loadable, LoadableCache } from './loadable';
import { TypedReducer } from 'redoodle';
import { ServiceActions, PropertyActions } from './serviceActions';

export function generateServiceReducer<ARG, RESULT>(
  actions: ServiceActions<ARG, RESULT>,
  reducerBuilder = TypedReducer.builder<LoadableCache<ARG, RESULT>>()
    .withDefaultHandler((state = LoadableCache.create<ARG, RESULT>()) => state)) {
  function loadingReducer(
    cache: LoadableCache<ARG, RESULT>,
    keys: ARG[]) {
    return cache.keysLoading(...keys);
  }
  function successReducer(
    cache: LoadableCache<ARG, RESULT>,
    result: { arg: ARG[], result: Map<ARG, RESULT> }) {
    return cache.loaded(result.result);
  }
  function errorReducer(
    cache: LoadableCache<ARG, RESULT>,
    error: { arg: ARG[], error: Error }) {
    return cache.errored(error.arg, error.error);
  }
  function clearReducer(
    cache: LoadableCache<ARG, RESULT>,
    keys: ARG[]) {
    return cache.clear(...keys);
  }
  function clearAllReducer(cache: LoadableCache<ARG, RESULT>) {
    return cache.clearAll();
  }
  return reducerBuilder
    .withHandler(actions.success.TYPE, successReducer)
    .withHandler(actions.loading.TYPE, loadingReducer)
    .withHandler(actions.error.TYPE, errorReducer)
    .withHandler(actions.clear.TYPE, clearReducer)
    .withHandler(actions.clearAll.TYPE, clearAllReducer);
}

export function generatePropertyReducer<RESULT>(
  actions: PropertyActions<any, RESULT>,
  reducerBuilder = TypedReducer.builder<Loadable<void, RESULT>>()
    .withDefaultHandler((state = { key: undefined, loading: false }) => state)) {
  function loadingReducer(state: Loadable<void, RESULT>, _: void) {
    return { ...state, loading: true };
  }
  function successReducer(state: Loadable<void, RESULT>, result: { arg: void, result: RESULT }) {
    return { key: state.key, loading: false, value: result.result, lastLoaded: new Date() };
  }
  function errorReducer(state: Loadable<void, RESULT>, result: { arg: void, error: Error }) {
    return { ...state, loading: false, error: result.error };
  }
  function clearReducer() {
    return { key: undefined, loading: false };
  }
  return reducerBuilder
    .withHandler(actions.success.TYPE, successReducer)
    .withHandler(actions.loading.TYPE, loadingReducer)
    .withHandler(actions.error.TYPE, errorReducer)
    .withHandler(actions.clear.TYPE, clearReducer);
}