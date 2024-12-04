# text-pin

This is a library to pin at a position in text, when modifing the test, the pin position will be updated (or be broken).

## Pin a line

Think that you have a block of code like:

```ts
function findMax(array: number[]) {
    if (array.length === 0) {
        throw new Error('Array is empty');
    }

    let max = array[0];

    for (let i = 1; i < array.length; i++) {
        if (array[i] > max) {
            max = array[i];
        }
    }

    return max;
}
```

Now you want to add a small ✨ on the line `let max = array[0];`, it's simple.

```ts
document.addStarToLine(6);
```

The problem is, while user continously modifies the code, the line number `6` could change over time, it's not simple to keep track of it.

the `LinePin` class is designed to solve this problem.

```ts
const pin = new LinePin(6);

document.addStarToLine(pin.getPinLineNumber());

// Update pin on document change
document.onTextChange(
    change => {
        document.removeStarFromLine(pin.getPinLineNumber());

        // We suppose a change object has `range` and a `text` property
        pin.edit(change.range, change.text);

        // If the pin still exists, add the star back
        if (!pin.isBroken()) {
            document.addStarToLine(pin.getPinLineNumber());
        }
    }
);
```
