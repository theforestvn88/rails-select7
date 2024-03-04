import { Controller } from "@hotwired/stimulus"
import debounce from "lodash.debounce"
import { Select7Controller } from "select7"

export default class extends Select7Controller(Controller, debounce) {}