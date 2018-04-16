const medicalStrainApp = {};
const apiKey = `HFyYeO7`;
const $medicalSymptoms = $('section#medicalSymptoms form');
const $selectedSymptoms = $('input[type=checkbox]:checked')
// Welcome message & Age Gateway 19+
medicalStrainApp.ageGate = () => {

}; //End Age Gate

let userSymptoms=[];
// How are you feeling/What are your symptoms?
medicalStrainApp.getUserSymptoms = () => {
	//grab checked values of medicalSymptoms
	$medicalSymptoms.on('submit',(e) => {

		e.preventDefault();
		let symptoms = $('input[type=checkbox]:checked').map(function (_, selectedSymptoms) {
			return $(selectedSymptoms).val();
		}).get();
		
		if (symptoms.length === 0 ) {
			$('p.error').html("Please make a selection.")
		} else {
			$('p.error').html('')
			userSymptoms.push(symptoms);
		}
		
	});
}; // End User Symptoms

//Get strains
medicalStrainApp.getStrainsByMedEffect = (medEffects) => {
	return $.ajax({
		url: `http://strainapi.evanbusse.com/${apiKey}/strains/search/effect/${medEffects}`,
		method: 'GET',
		dataType: 'JSON'
	});
};

let filteredStrainsID = [];
let allFilteredStrains = [];
let uniqueStrains = [];
// Try these strains
medicalStrainApp.filterStrainsByID = () => {
	//on click also submit symptoms into 
	
	// on submit send symptoms through 
	$medicalSymptoms.on('submit', (e) => {
		e.preventDefault();
		//reset arrays
		filteredStrainsID = [];
		allFilteredStrains = [];
		uniqueStrains = [];
		let strainID = [];
		//grab latest submitted symptoms
		let medEffects = userSymptoms.slice(-1)[0]; 
		console.log(medEffects);
		//getStrainsByMedEffect
		const gettingStrains = medEffects.map((medEffect) => {
			return medicalStrainApp.getStrainsByMedEffect(medEffect);
		});
		$.when(...gettingStrains)
			.then((...strains) => {
				// console.log(strains);
				// if medEffects = more than one string then...
				if (medEffects.length > 1 ) {
					//...loop through strains array and grab first array...
					strains.forEach((x) => {
						console.log(x[0]);
						//...loop through those arrays and grab the strain object
						x[0].forEach((y) => {
							strainID.push(y.id);
							allFilteredStrains.push(y);
						}) //end loop
					}) //end outter loop
				} else if (medEffects.length === 1) {
					// else if one string grab index0 from strains
					// console.log(strains[0])
					//loop through index0 array to grab strain object
					strains[0].forEach((i) => {
						strainID.push(i.id)
						allFilteredStrains.push(i);
					}); //endloop
				}; //end ifElse

				// filter strainID for unique values and put into filteredStrainsID
				$.each(strainID, (a, el) => {
					if ($.inArray(el, filteredStrainsID) === -1) filteredStrainsID.push(el);
				});
				console.log(filteredStrainsID)

				//filter through allFilteredStrains array for unique object.key value and put into filteredStrains - solution from https://stackoverflow.com/questions/43374112/filter-unique-values-from-an-array-of-objects
				allFilteredStrains.filter((item) => {
					var i = uniqueStrains.findIndex(x => x.name == item.name);
					if(i <= -1)
						uniqueStrains.push({id: item.id, name: item.name, race: item.race});
				});
				
				//empty display
				$displayStrain.html('');
				
				//display unique strains
				uniqueStrains.forEach((strain) => {
					if (strain.race === 'hybrid') {
						$displayStrain.append(
							$('<li class="hybrid">').attr('id',strain.id).append(	
								`<p class="name">${strain.name}</p>
								<p class="strainType">${strain.race}</p>`
							)
						)
					} else if (strain.race === 'indica') {
						$displayStrain.append(
							$('<li class="indica">').attr('id', strain.id).append(
								`<p class="name">${strain.name}</p>
								<p class="strainType">${strain.race}</p>`
							)
						)
					} else if (strain.race === 'sativa') {
						$displayStrain.append(
							$('<li class="sativa">').attr('id', strain.id).append(
								`<p class="name">${strain.name}</p>
								<p class="strainType">${strain.race}</p>`
							)
						);
					};
				}); // end forEach
			});//end .then
			
	}); // end form listener
}; // END try these strains
let $displayStrain = $('ul.displayStrains');
medicalStrainApp.getStrainInfo = (strain) => {
	return $.ajax({
		url: `http://strainapi.evanbusse.com/${apiKey}/strains/data/desc/${strain.id}`,
		method: 'GET',
		dataType: 'JSON'
	});
};

// Strain Page
medicalStrainApp.strainPage = () => {
	//attemp to show strain details
};


medicalStrainApp.init = () => {
	medicalStrainApp.getUserSymptoms();
	medicalStrainApp.getStrainsByMedEffect();
	medicalStrainApp.filterStrainsByID();
	medicalStrainApp.strainPage();
};

$(function() {
	medicalStrainApp.init();
})

//MVP PSUEDO

// Welcome message & Age Gateway 19+
// How are you feeling/What are your symptoms?
// Try these strains
// Strain Page