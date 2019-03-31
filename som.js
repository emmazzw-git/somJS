const colorNumber = 3;
const nodeMatrixWidth = 10;
const nodeMatrixHeight = 10;
const inputVectorLength = 10;
const maxIteration = 100;
const initialLearningRate = 0.1;

//generate constants
const initialRadius = Math.max(nodeMatrixWidth, nodeMatrixHeight) / 2;
const timeConstant = maxIteration / (Math.log(initialRadius));

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

// generate the weight vector
for (let p = 0; p < nodeMatrixWidth; p++) {
    let weightVectorX = [];
    for (let q = 0; q < nodeMatrixHeight; q++) {
        let weightVectorXElement = [];
        for (let s = 0; s < inputVectorLength; s++) {
            let weightVectorXYElement = [];
            for (let r = 0; r < colorNumber; r++) {
                weightVectorXYElement[r] = Math.random();
            }
            weightVectorXElement[s] = weightVectorXYElement;
        }
		weightVectorX[q] = weightVectorXElement;
    }
    weightVectorXY[p] = weightVectorX;
}

// BMU
const generateBMU = () => {
	let distanceXY = [];
	let minValueBMU = 0;
	for (let m = 0; m < nodeMatrixWidth; m++) {
		let distanceX = [];
		for (let n = 0; n < nodeMatrixHeight; n++) {
            let singleNodeInputVectorDistanceSum = 0;
            for (let k = 0; k < inputVectorLength; k++) {
                let singleNodeInputElementDistanceSum = 0;
                for (let l = 0; l < colorNumber; l++) {
                    singleNodeInputElementDistanceSum += Math.pow((inputVector[k][l] - weightVectorXY[m][n][k][l]), 2);
                }
                singleNodeInputVectorDistanceSum += singleNodeInputElementDistanceSum;
            }
			distanceX[n] = Math.sqrt(singleNodeInputVectorDistanceSum);
		}
		distanceXY[m] = distanceX;   
	}
	minValueBMU = Math.min.apply(null, distanceXY.flat());
	
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
// @param iterationNum
const getNeighbourRadius = (iterationNum) => {
	return initialRadius * Math.exp(iterationNum/timeConstant);
};

// calculate learning rate
// @param iterationNum
const getLearningRate = (iterationNum) => {
	return initialLearningRate * Math.exp(iterationNum/timeConstant);
};

// calculate node weight to BMU weight distance
const getWeightDistance = () => {
	const { bmuWeight } = getBMUWeight();
	
	let weightDistanceXY = [];
	
	for (let s = 0; s < nodeMatrixWidth; s++) {
		let weightDistanceX = [];
		for (let t = 0; t < nodeMatrixHeight; t++) {
            let singleNodeWeightDistanceSum = 0;
            for (let v = 0; v < inputVectorLength; v++) {
                let singleNodeInputElementWeightDistanceSum = 0;
                for (let w = 0; w < colorNumber; w++) {
                    singleNodeWeightDistanceSum += Math.pow((weightVectorXY[s][t][v][w] - bmuWeight[v][w]),2);
                }
                singleNodeWeightDistanceSum += singleNodeInputElementWeightDistanceSum;
            }
			weightDistanceX[t] = Math.sqrt(singleNodeWeightDistanceSum);
		}
		weightDistanceXY[s] = weightDistanceX;
	}
	return { weightDistanceXY };
};

// calculate influence
// @param iterationNum
// @param node ith weight distance
const getInfluence = (iterationNum, weightDistance) => {
	
	const radius = getNeighbourRadius(iterationNum);
	
	return Math.exp(-(Math.pow(weightDistance, 2) / (2 * Math.pow(radius, 2))));
};

// calculate updated weight
// @param iterationNum 
const updateWeight = (iterationNum) => {
    const { weightDistanceXY } = getWeightDistance();
    let learningRate = getLearningRate(iterationNum);
    for (let u = 0; u < nodeMatrixWidth; u++) {
        for (let v = 0; v < nodeMatrixHeight; v++) {
            let weightDelta = [];
            let influenceRate = getInfluence(iterationNum, weightDistanceXY[u][v]);
            // naiive assumption on current value of the input vector
            for (let g = 0; g < inputVectorLength; g++) {
                let inputElementWeightDiffVector = [];
                for (let h = 0; h < colorNumber; h++) {
                    inputElementWeightDiffVector[h] = inputVector[g][h] - weightVectorXY[u][v][g][h];
                    weightDelta[h] = learningRate * influenceRate * inputElementWeightDiffVector[h];
                    weightVectorXY[u][v][g][h] = parseFloat((weightVectorXY[u][v][g][h] + weightDelta[h]).toFixed(2));
                }
            }
        }
    }
    return weightVectorXY;
};

updateWeight(maxIteration);

/*TODO:
1. Pick up an index of the updatedWeight and calcuate the color value 
2. Interprete the color value and plot
    https://plot.ly/javascript/colorscales/
3. Apply more iterations in bigger grid size
*/

