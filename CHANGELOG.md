# Changelog

All notable changes to [@camunda/form-playground](https://github.com/camunda/form-playground) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 0.9.0-alpha.0

* `FEAT`: use `drag.*` events to set drop target styles ([#53](https://github.com/camunda/form-playground/issues/53))
* `FEAT`: localized date picker based on browser language ([#733](https://github.com/bpmn-io/form-js/issues/733))
* `FEAT`: added placeholder to playground input panel ([0f696119](https://github.com/bpmn-io/form-js/commit/0f6961191c076f8cc2d221428b2d7fdbab9a2fe3))
* `FEAT`: implemented Group component with multiple updates ([#768](https://github.com/bpmn-io/form-js/pull/768))
* `FEAT`: added support for nested component keys ([#464](https://github.com/bpmn-io/form-js/issues/464))
* `FIX`: dropdown options no longer reset when form reopens ([#764](https://github.com/bpmn-io/form-js/issues/764))
* `FIX`: removed keying from buttons ([#778](https://github.com/bpmn-io/form-js/issues/778))
* `DEPS`: update `properties-panel` to v3.3.0
* `DEPS`: update `form-js` to 1.3.0-alpha.0

## 0.8.0

* `FEAT`: add `spacer` component ([#731](https://github.com/bpmn-io/form-js/issues/731))
* `FEAT`: eagerly validate form preview on blur and input ([#610](https://github.com/bpmn-io/form-js/pull/610))
* `FEAT`: update empty state for form editor ([#336](https://github.com/bpmn-io/form-js/issues/336))
* `DEPS`: update `form-js` to 1.1.0

## 0.7.0

* `FEAT`: support FEEL and templates for `prefixAdorner` and `suffixAdorner` ([#663](https://github.com/bpmn-io/form-js/pull/663))
* `FEAT`: support templates for `alt` and `source` properties ([#663](https://github.com/bpmn-io/form-js/pull/663))
* `FEAT`: support FEEL to populate multiselect values via `valuesExpression` ([#673](https://github.com/bpmn-io/form-js/issues/673))
* `FEAT`: support FEEL for `min`, `max`, `minLength` and `maxLength` ([#668](https://github.com/bpmn-io/form-js/pull/668))
* `FEAT`: support FEEL for `label` and `description` ([#658](https://github.com/bpmn-io/form-js/pull/658))
* `FEAT`: support `readonly` form field property ([#636](https://github.com/bpmn-io/form-js/pull/636))
* `FEAT`: make editor form fields accessible via keyboard ([#173](https://github.com/bpmn-io/form-js/issues/173))
* `FEAT`: display editor form fields as readonly ([#636](https://github.com/bpmn-io/form-js/pull/636))
* `FEAT`: allow uneven columns ([#605](https://github.com/bpmn-io/form-js/issues/605))
* `FEAT`: resize form fields ([#566](https://github.com/bpmn-io/form-js/issues/566))
* `FEAT`: re-export external library styles separately ([#677](https://github.com/bpmn-io/form-js/issues/677))
* `FEAT`: add `fjs-no-theme` selector to disable themable styles ([#680](https://github.com/bpmn-io/form-js/issues/680))
* `FIX`: support markdown tables in `text` components ([#205](https://github.com/bpmn-io/form-js/issues/205))
* `DEPS`: update `form-js` to 1.0.0

## 0.6.0

* `FEAT`: implemented required parameter for checkboxes, checklists and taglists ([#594](https://github.com/bpmn-io/form-js/issues/594))
* `DEPS`: update to `form-js` to 0.14.1

## 0.5.2

* `DEPS`: update to `form-js` to 0.13.1

## 0.5.1

* `FIX`: override selection color for template editor

## 0.5.0

* `FEAT`: allow primitives for multi select values ([#542](https://github.com/bpmn-io/form-js/issues/542))
* `FEAT`: support more flexible rows layout with columns ([#560](https://github.com/bpmn-io/form-js/issues/560))
* `FEAT`: support FEEL templating in `text` components ([#567](https://github.com/bpmn-io/form-js/pull/567))
* `DEPS`: update to `form-js` to 0.13.0

### Breaking Changes

* `@camunda/form-playground/dist/assets/dragula.css` got removed
* `@camunda/form-playground/assets/flatpickr/light.css` got removed
* `@camunda/form-playground/assets/properties-panel.css` got removed

The missing styles are included in the general style exports (`form-js.css`, `form-js-editor.css`, `form-js-playground.css`). If you need the base styles on their own, please find them in the additional `*-base.css` exports in the `dist/assets` directory.


## 0.4.1

* `DEPS`: update to `form-js` to 0.12.1

## 0.4.0 

* `FEAT`: add scalable component library ([#49](https://github.com/camunda/form-playground/issues/49))
* `FEAT`: support searchable `select` component 
* `FEAT`: add auto complete for variable names in JSON editor ([#295](https://github.com/bpmn-io/form-js/issues/295))
* `FEAT`: emit `drag.*` events ([#462](https://github.com/bpmn-io/form-js/issues/462))
* `FEAT`: disable `text` links in editor ([#439](https://github.com/bpmn-io/form-js/issues/439))
* `DEPS`: update `form-js` to 0.12.0 ([`4d6a8733`](https://github.com/camunda/form-playground/commit/4d6a873321135c9b6c7ecbae7ae406bebdeaf088))

## 0.3.2 

* `DEPS`: update `diagram-js` to 11.14.4 ([#47](https://github.com/camunda/form-playground/pull/47))

## 0.3.1

* `FIX`: update `form-js` dependencies to 0.10.1 ([`441305e3`](https://github.com/camunda/form-playground/commit/441305e327eecda5782e957ad95a90b30436567c))

## 0.3.0

* `FEAT`: expose `once` event handler ([`9433e9ac`](https://github.com/camunda/form-playground/commit/9433e9ace2b2302631b2806dcf7dc0f8a71581ef))
* `FEAT`: integrate `diagram-js/ui/lib` ([#28](https://github.com/camunda/form-playground/issues/28))
* `FIX`: correctly apply fonts ([`83a3a4fe`](https://github.com/camunda/form-playground/commit/83a3a4fede1d01132c6fbcc3a778e952af9bd9bf))
* `FIX`: style drag container ([#41](https://github.com/camunda/form-playground/pull/41))

## 0.2.1

* `FIX`: fixed horizontal code editor scrolling ([`a5f661c9`](https://github.com/camunda/form-playground/commit/a5f661c9bad6353cba6677c3e75a872df210361e))
* `FIX`: fixed editor drop area size ([`0a0aad85`](https://github.com/camunda/form-playground/commit/0a0aad852c50360006fdd9d234cd3375a7c657ed))
* `FIX`: limit editor changes to panels ([`0efa0edc`](https://github.com/camunda/form-playground/commit/0efa0edcb4e4fe2087ab9919ac06823b33a8e17a))

## 0.2.0

* `FEAT`: add `#getDataEditor`, `#getForm`, and `#getResultView` ([#19](https://github.com/camunda/form-playground/issues/19))

## 0.1.2

* `FIX`: set `display: none` for output and preview in design mode ([#17](https://github.com/camunda/form-playground/issues/17))

## 0.1.1 

* `FIX`: correct palette scrolling ([`c85d9abb`](https://github.com/camunda/form-playground/commit/c85d9abb413bb73322dcc82ff3dafd178cdf05b2))
* `FIX`: correct editor scrolling ([#11](https://github.com/camunda/form-playground/issues/11))
* `FIX`: correct code editor scrolling ([`5a24398a`](https://github.com/camunda/form-playground/commit/5a24398a7822cbad2151295542dad5da01c8e65a))

## 0.1.0

* `FEAT`: initial release :tada:
