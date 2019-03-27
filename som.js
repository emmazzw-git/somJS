let colorNumber = 3;
let nodeMatrixWidth = 10;
let nodeMatrixHeight = 10;
let inputVectorLength = 10;
let maxIternation = 100;

//generate constants
let initialRadius = Math.max(nodeMatrixWidth, nodeMatrixHeight) / 2;
let timeConstant = maxIternation / (Math.log(initialRadius));
const initialLearningRate = 0.1;

// initialization
let inputVector = []; // initial input vector
let weightVectorXY = []; // initial weight vector
let bmuWeight = []; // initial BMU weight

// generate the input vector
for (let i = 0; i < inputVectorLength; i++) {
    let inputVectorColorData = [];
    for (let j = 0; j < colorNumber; j++) {
        inputVectorColorData[j] = Math.random();
    }
    inputVector[i] = inputVectorColorData;
}
console.log(inputVector);

// generate the weight vector
for (let p = 0; p < nodeMatrixWidth; p++) {
    let weightVectorX = [];
    for (let q = 0; q < nodeMatrixHeight; q++) {
        let weightVectorXElement = [];
		for (let r = 0; r < colorNumber; r++) {
			weightVectorXElement[r] = Math.random();
		}
		weightVectorX[q] = weightVectorXElement;
    }
    weightVectorXY[p] = weightVectorX;
}
console.log(weightVectorXY);


// BMU
const generateBMU = () => {
	let distanceXY = [];
	let minValueBMU = 0;
	for (let m = 0; m < nodeMatrixWidth; m++) {
		let distanceX = [];
		for (let n = 0; n < nodeMatrixHeight; n++) {
			let singleNodeDistanceSum = 0;
			for (let l = 0; l < colorNumber; l++) {
				singleNodeDistanceSum += Math.pow((inputVector[n][l] - weightVectorXY[m][n][l]), 2);
			}
			distanceX[n] = Math.sqrt(singleNodeDistanceSum);
		}
		distanceXY[m] = distanceX;
	}
	minValueBMU = Math.min.apply(null, distanceXY.flat());
	
	console.log('distanceXY', distanceXY);
	console.log('flattened distanceXY', distanceXY.flat());
	console.log('min value', Math.min(Math.min.apply(null, distanceXY.flat())));
	
	return {
		distanceXY,
		minValueBMU
	};
};

// BMU weight
const getBMUWeight = () => {
	const { distanceXY, minValueBMU } = generateBMU();
	
	for (let x = 0; x < nodeMatrixWidth; x++) {
		for(let y = 0; y < nodeMatrixHeight; y++) {
			if (distanceXY[x][y] === minValueBMU) {
				bmuWeight = weightVectorXY[x][y];
				return { x, y, bmuWeight };
			}
		}
	}
};

// calculate neighbourhood radius
// @param iternation t
const getNeighbourRadius = (t) => {
	return initialRadius * Math.exp(t/timeConstant);
};

// calculate learning rate
// @param iternation t
const getLearningRate = (t) => {
	return initialLearningRate * Math.exp(t/timeConstant);
};

// calculate node weight to BMU weight distance
const getWeightDistance = () => {
	const { bmuWeight } = getBMUWeight();
	
	let weightDistanceXY = [];
	
	for (let s = 0; s < nodeMatrixWidth; s++) {
		let weightDistanceX = [];
		for (let t = 0; t < nodeMatrixHeight; t++) {
			let singleNodeWeightDistanceSum = 0;
			for (let w = 0; w < colorNumber; w++) {
				singleNodeWeightDistanceSum += Math.pow((weightVectorXY[s][t][w] - bmuWeight[w]),2);
			}
			weightDistanceX[t] = Math.sqrt(singleNodeWeightDistanceSum);
		}
		weightDistanceXY[s] = weightDistanceX;
	}
	
	console.log('weightDistanceXY', weightDistanceXY);
	return { weightDistanceXY };
};


// TODO:
// calculate updated weight
// @param iteration t
const updateWeight = (t) => {
	const { weightDistanceXY } = getWeightDistance();
	for (let u = 0; u < nodeMatrixWidth; u++) {
		for (let v = 0; v < nodeMatrixHeight; v++) {
			weightDistanceXY[u][v]
		}
	}
};

// calculate influence
// @param iteration t
/*const getInfluence = (t) => {
	
	const radius = getNeighbourRadius(t);
	
	return (2 * Math.pow(radius, 2));
};*/

getBMUWeight();
getWeightDistance();
