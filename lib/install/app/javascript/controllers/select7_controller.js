import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = [ "selected", "input", "suggestion", "template" ]
    static values = { suggestApi: String, name: String, multiple: Boolean, items: Array }

    connect() {
        this.count = 0
        this.timeoutId = null
        this.element.addEventListener("turbo:submit-end", this.clearForm.bind(this))
        if (this.hasInputTarget) {
            this.inputTarget.setAttribute("autocomplete", "off")
        }
        this.keysLps = {}
    }

    suggest() {
        if (this.suggestApiValue && this.suggestApiValue != "") {
            this.remoteSuggest()
        } else if (this.hasItemsValue) {
            this.localSuggest()
        }
    }

    localSuggest() {
        const key = this.inputTarget.value.toLowerCase()
        if (key != "") {
            this.suggestionTarget.innerHTML = ""
            this.itemsValue.forEach(item => {
                const found = this.kmp(key, item[1].toLowerCase())
                if (found > -1) {
                    const optionItem = document.createElement("p")
                    optionItem.setAttribute("id", item[0])
                    optionItem.setAttribute("data-action", "click->select7#selectTag")
                    optionItem.setAttribute("class", "select7-option-item")
                    
                    const prefix = document.createElement("span")
                    prefix.innerText = item[1].substring(0, found)
                    optionItem.appendChild(prefix)
                    
                    const highlight = document.createElement("span")
                    highlight.setAttribute("class", "font-bold")
                    highlight.innerText = item[1].substring(found, found + key.length)
                    optionItem.appendChild(highlight)

                    const suffix = document.createElement("span")
                    suffix.innerText = item[1].substring(found + key.length)
                    optionItem.appendChild(suffix)
                    
                    this.suggestionTarget.appendChild(optionItem)
                }
            })
            this.suggestionTarget.classList.remove("select7-hidden")
        } else {
            this.suggestionTarget.classList.add("select7-hidden")
        }
    }

    remoteSuggest() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId)
        }

        this.timeoutId = setTimeout(() => {
            let searchKey = this.inputTarget.value.replaceAll(/[^\w]/g, '')
            let suggestQuery = this.suggestApiValue + `?key=${searchKey}`
            fetch(suggestQuery)
                .then((r) => r.text())
                .then((html) => {
                    if (html != "") {
                        this.suggestionTarget.innerHTML = html
                        this.suggestionTarget.classList.remove("select7-hidden")
                    } else {
                        this.suggestionTarget.classList.add("select7-hidden")
                    }
                })
        }, 200) // debounce 200
    }

    selectTag(e) {
        const selectedView = e.target

        const input = document.createElement("input")
        input.setAttribute("type", "hidden")
        input.setAttribute("value", selectedView.getAttribute("value"))
        input.setAttribute("name", this.nameValue.replace("[]", `[${this.count}]`))

        const selectedItem = this.templateTarget.cloneNode(true)
        selectedItem.appendChild(input)
        selectedItem.insertAdjacentHTML("afterbegin", selectedView.innerHTML)
        selectedItem.classList.remove("select7-hidden")
        this.selectedTarget.appendChild(selectedItem)
        
        this.inputTarget.value = ""

        if (!this.multipleValue) {
            this.inputTarget.classList.add("select7-invisible")
        }

        this.suggestionTarget.classList.add("select7-hidden")

        this.count--
    }

    removeTag(e) {
        const removeView = e.target.parentElement

        if (removeView.hasAttribute("data-remove-id")) {
            const input = document.createElement("input")
            input.setAttribute("type", "hidden")
            input.setAttribute("name", removeView.getAttribute("data-remove-id"))
            input.setAttribute("value", removeView.getAttribute("data-remove-value"))

            this.selectedTarget.appendChild(input)
            removeView.querySelectorAll('input').forEach(v => this.selectedTarget.appendChild(v))
        }

        this.selectedTarget.removeChild(removeView)
        this.inputTarget.classList.remove("select7-invisible")
    }

    clearForm() {
        this.selectedTarget.innerHTML = ""
    }

    lps(key) {
        if (this.keysLps[key]) 
            return this.keysLps[key]

        let lpsArr = Array(key.length).fill(0) 
        let i = 1
        let c = 0
        
        while(i < key.length) {
            if (key[i] == key[c]) {
                lpsArr[i++] = ++c
            } else if (c > 0) {
                c = lpsArr[c - 1]
            } else {
                i++
            }
        }

        this.keysLps[key] = lpsArr
        return this.keysLps[key]
    }

    kmp(key, item) {
        const k_len = key.length
        const s_len = item.length

        if(k_len === 0) return 0

        const k_lps = this.lps(key)
        let i = 0
        let j = 0

        while (i < s_len) {
            if (item[i] == key[j]) {
                i++
                j++
                if(j === k_len) return i - k_len
            } else if (j > 0) {
                j = k_lps[j-1]
            } else {
                i++
            }
        }

        return -1
    }
}
