const axios = require("axios");

/**
 * @param {string} collection directus collection name
 * @param {string} item Id of the record of a collection
 * @param {object} query Query object 
 * @param {boolean} isCustom Specifies this operation is done on default collection or normal collection
 * @returns {object} Returns collection record object
 */
async function readCollectionDataById(collection, item, query, isCustom = true) {
	var url = isCustom ? `${BASE_URL}/items/${collection}/${item}?` : `${BASE_URL}/${collection}/${item}`;

	if (query != null) {
		Object.entries(query).forEach(([key, value]) => {
			console.log("Key: ", key, "Value: ", value);
			if (key == "filter") {
				url = `${url}${key}=${JSON.stringify(value)}&`;
			} else {
				url = `${url}${key}=${value}&`;
			}
			
		});
	}

	// const filter = JSON.stringify(query);
	let createGetConfig = {
		method: 'get',
		maxBodyLength: Infinity,
		url: url,
		headers: { 
			'Content-Type': 'application/json', 
			'Authorization': `Bearer ${process.env.STATIC_ACCESS_TOKEN}`
		},
	};

	const response = await axios.request(createGetConfig);
	if (response.status == 200) {
		return response.data.data[0];
	}
}

async function readCollectionDataByQuery(collection, query, expectMultiple=false, isCustom=true) {
	var url = isCustom ? `${BASE_URL}/items/${collection}?` : `${BASE_URL}/${collection}`

	Object.entries(query).forEach(([key, value]) => {
		if (key == "filter") {
			url = `${url}${key}=${JSON.stringify(value)}&`
		} else {
			url = `${url}${key}=${value}&`
		}
	});

	console.log("READ URL: ", url);

	let createGetConfig = {
		method: 'get',
		maxBodyLength: Infinity,
		url: url,
		headers: { 
			'Content-Type': 'application/json', 
			'Authorization': `Bearer ${process.env.STATIC_ACCESS_TOKEN}`
		},
	};

	const response = await axios.request(createGetConfig)
	if (response.status == 200) {
		if (expectMultiple) {
			return response.data.data;
		} else {
			return response.data.data[0];
		}
		
	} else {
		null;
	}
}

async function updateCollectionDataById(collection, item, body, isCustom = true) {
	const url = isCustom ? `${BASE_URL}/items/${collection}/${item}` : `${BASE_URL}/${collection}/${item}`;
	const data = JSON.stringify(body);
	
	let createPatchConfig = {
		method: 'patch',
		maxBodyLength: Infinity,
		url: url,
		headers: { 
			'Content-Type': 'application/json', 
			'Authorization': `Bearer ${process.env.STATIC_ACCESS_TOKEN}`
		},
		data : data
	};

	const response = await axios.request(createPatchConfig);
	if (response.status == 200) {
		return response.data;
	} else {
		return null;
	}
}

async function createCollectionData(collection, body, isCustom = true) {
	const url = isCustom ? `${BASE_URL}/items/${collection}` : `${BASE_URL}/${collection}`;
	const data = JSON.stringify(body);
	
	let createPatchConfig = {
		method: 'post',
		maxBodyLength: Infinity,
		url: url,
		headers: { 
			'Content-Type': 'application/json', 
			'Authorization': `Bearer ${process.env.STATIC_ACCESS_TOKEN}`
		},
		data : data
	};

	const response = await axios.request(createPatchConfig);
	if (response.status == 200) {
		return response.data.data;
	} else {
		return null;
	}
}

async function deleteCollectionData(collection, itemId) {
	const url = `${BASE_URL}/items/${collection}/${itemId}`;
	
	let createPatchConfig = {
		method: 'delete',
		maxBodyLength: Infinity,
		url: url,
		headers: { 
			'Content-Type': 'application/json', 
			'Authorization': `Bearer ${process.env.STATIC_ACCESS_TOKEN}`
		},
	};

	const response = await axios.request(createPatchConfig);
	return response.status;
}

module.exports = {
    readCollectionDataById,
    readCollectionDataByQuery,
    updateCollectionDataById,
    createCollectionData,
    deleteCollectionData
}