import {test, expect} from 'vitest';
import {LinePin} from '../line.js';

test('insert lines before line', () => {
    const pin = new LinePin(1, 20);
    pin.edit({start: {line: 0, character: 10}, end: {line: 0, character: 10}}, 'hello\nworld\n');
    expect(pin.isBroken()).toBe(false);
    expect(pin.getPinLineNumber()).toEqual(3);
});

test('insert new line at start of pin', () => {
    const pin = new LinePin(0, 20);
    pin.edit({start: {line: 0, character: 0}, end: {line: 0, character: 0}}, '\n');
    expect(pin.isBroken()).toBe(false);
    expect(pin.getPinLineNumber()).toEqual(1);
});

test('insert new line at start of pin with remaining text', () => {
    const pin = new LinePin(0, 20);
    pin.edit({start: {line: 0, character: 0}, end: {line: 0, character: 0}}, '\nhello');
    expect(pin.isBroken()).toBe(true);
    expect(pin.getPinLineNumber()).toEqual(-1);
});

test('insert multiple lines at start of pin', () => {
    const pin = new LinePin(0, 20);
    pin.edit({start: {line: 0, character: 0}, end: {line: 0, character: 0}}, 'hello\nworld\n\n');
    expect(pin.isBroken()).toBe(false);
    expect(pin.getPinLineNumber()).toEqual(3);
});

test('insert new line insert at end of line', () => {
    const pin = new LinePin(2, 20);
    pin.edit({start: {line: 2, character: 20}, end: {line: 2, character: 20}}, '\n');
    expect(pin.isBroken()).toBe(false);
    expect(pin.getPinLineNumber()).toEqual(2);
});

test('insert at end of line with leading text', () => {
    const pin = new LinePin(2, 20);
    pin.edit({start: {line: 2, character: 20}, end: {line: 2, character: 20}}, 'hello\n');
    expect(pin.isBroken()).toBe(true);
    expect(pin.getPinLineNumber()).toEqual(-1);
});

test('insert multiple lines after', () => {
    const pin = new LinePin(2, 20);
    pin.edit({start: {line: 3, character: 20}, end: {line: 3, character: 20}}, 'hello\nworld\n\n');
    expect(pin.isBroken()).toBe(false);
    expect(pin.getPinLineNumber()).toEqual(2);
});

test('edit code before', () => {
    const pin = new LinePin(5, 20);
    pin.edit({start: {line: 2, character: 5}, end: {line: 4, character: 10}}, 'hello\nworld');
    expect(pin.isBroken()).toBe(false);
    expect(pin.getPinLineNumber()).toEqual(4);
});

test('edit code after', () => {
    const pin = new LinePin(5, 20);
    pin.edit({start: {line: 6, character: 10}, end: {line: 9, character: 5}}, 'hello\nworld');
    expect(pin.isBroken()).toBe(false);
    expect(pin.getPinLineNumber()).toEqual(5);
});

test('insert in the middle of line', () => {
    const pin = new LinePin(1, 20);
    pin.edit({start: {line: 1, character: 5}, end: {line: 1, character: 5}}, '\n');
    expect(pin.isBroken()).toBe(true);
    expect(pin.getPinLineNumber()).toEqual(-1);
});

test('edit overlap pinned line', () => {
    const pin = new LinePin(5, 20);
    pin.edit({start: {line: 4, character: 10}, end: {line: 9, character: 5}}, 'hello\nworld');
    expect(pin.isBroken()).toBe(true);
    expect(pin.getPinLineNumber()).toEqual(-1);
});

test('edit intersect pinned line', () => {
    const pin = new LinePin(5, 20);
    pin.edit({start: {line: 2, character: 10}, end: {line: 5, character: 5}}, 'hello\nworld');
    expect(pin.isBroken()).toBe(true);
    expect(pin.getPinLineNumber()).toEqual(-1);
});

test('edit start at line and modified line content', () => {
    const pin = new LinePin(5, 20);
    pin.edit({start: {line: 5, character: 18}, end: {line: 6, character: 5}}, 'hello\nworld');
    expect(pin.isBroken()).toBe(true);
    expect(pin.getPinLineNumber()).toEqual(-1);
});

test('edit start at end of line and modified line content', () => {
    const pin = new LinePin(5, 20);
    pin.edit({start: {line: 5, character: 20}, end: {line: 6, character: 5}}, 'hello\nworld');
    expect(pin.isBroken()).toBe(true);
    expect(pin.getPinLineNumber()).toEqual(-1);
});

test('edit end at line and modified line content', () => {
    const pin = new LinePin(5, 20);
    pin.edit({start: {line: 2, character: 5}, end: {line: 5, character: 0}}, 'hello\nworld');
    expect(pin.isBroken()).toBe(true);
    expect(pin.getPinLineNumber()).toEqual(-1);
});

test('edit end at line and insert new lines before line', () => {
    const pin = new LinePin(5, 20);
    pin.edit({start: {line: 2, character: 5}, end: {line: 5, character: 0}}, 'hello\n\n');
    expect(pin.isBroken()).toBe(false);
    expect(pin.getPinLineNumber()).toEqual(4);
});

test('edit at end of line with leading new line', () => {
    const pin = new LinePin(5, 20);
    pin.edit({start: {line: 5, character: 20}, end: {line: 6, character: 10}}, '\nworld');
    expect(pin.isBroken()).toBe(false);
    expect(pin.getPinLineNumber()).toEqual(5);
});

test('edit on broken', () => {
    const pin = new LinePin(5, 20);
    pin.edit({start: {line: 2, character: 5}, end: {line: 10, character: 0}}, '');
    pin.edit({start: {line: 1, character: 0}, end: {line: 1, character: 0}}, 'hello');
    expect(pin.isBroken()).toBe(true);
    expect(pin.getPinLineNumber()).toEqual(-1);
});
