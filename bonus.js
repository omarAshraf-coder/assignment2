//solve the problem kth-missing-positive-number on leetcode
function findKthPositive(arr, k) {
    let current = 1;
    let index = 0;

    while (k > 0) {
        if (index < arr.length && arr[index] === current) {
            index++;
        } else {
            k--;
            if (k === 0) {
                return current;
            }
        }
        current++;
    }
}

//copy the code that you have submitted on the wevsite inside bonus.js file

function findKthPositive(arr, k) {
    let current = 1;
    let index = 0;

    while (k > 0) {
        if (index < arr.length && arr[index] === current) {
            index++;
        } else {
            k--;
            if (k === 0) {
                return current;
            }
        }
        current++;
    }
}