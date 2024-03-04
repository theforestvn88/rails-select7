import { Controller } from "@hotwired/stimulus"
import debounce from "lodash.debounce"

export default class extends Select7Controller(Controller, debounce) {}