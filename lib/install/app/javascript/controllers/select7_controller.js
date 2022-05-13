import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = [ "tagsContainer", "input", "suggestionTags" ]
    static values = { suggestApi: String }

    connect() {}

    suggest() {
        if (this.suggestApiValue && this.suggestApiValue != "") {
            this.remoteSuggest()
        } else {
            this.localSuggest()
        }
    }

    remoteSuggest() {
        let suggestQuery = this.suggestApiValue + `?key=${this.inputTarget.value}`
        fetch(suggestQuery)
            .then((r) => r.text())
            .then((html) => {
                this.suggestionTagsTarget.innerHTML = html
                this.suggestionTagsTarget.classList.remove("hidden")
            })
    }

    localSuggest() {
        const key = this.inputTarget.value
        this.suggestionTagsTarget.childNodes.forEach(node => {
            if (node.nodeType == Node.ELEMENT_NODE) {
                node.classList.remove("hidden")
                if (node.id.toLowerCase().indexOf(key.toLowerCase()) == -1) {
                    node.classList.add("hidden")
                }
            }
        });
        this.suggestionTagsTarget.classList.remove("hidden")
    }

    selectTag(e) {
        const selectedView = e.target.parentElement
        const cloneView = selectedView.cloneNode(true)
        const hiddenInput = document.createElement("input")
        hiddenInput.type = "hidden"
        hiddenInput.name = cloneView.getAttribute('name')
        hiddenInput.value = cloneView.getAttribute('value')
        cloneView.appendChild(hiddenInput)
        cloneView.classList.add("select7-selected-item")
        cloneView.classList.remove("hidden")
        cloneView.querySelector(".select7-item-close").classList.remove("hidden")
        cloneView.querySelector(".select7-option-item").classList.remove("select7-option-item")

        this.tagsContainerTarget.appendChild(cloneView)

        this.suggestionTagsTarget.classList.add("hidden")
        this.inputTarget.value = ""
    }

    removeTag(e) {
        this.tagsContainerTarget.removeChild(e.target.parentElement)
    }
}
