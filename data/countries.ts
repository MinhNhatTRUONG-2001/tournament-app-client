export var countries: any[] = []
export var countryNames: any[] = ['']

fetch("https://countriesnow.space/api/v0.1/countries/codes")
.then(response => response.json())
.then(data => {
    countries = data["data"]
    countries.map(c => countryNames.push(c["name"]))
})
.catch(console.error)