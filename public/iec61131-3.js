(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
    "use strict";
    var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __exportStar = (this && this.__exportStar) || function(m, exports) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromString = void 0;
    /*
    https://github.com/jisotalo/iec-61131-3
    
    Copyright (c) 2021 Jussi Isotalo <j.isotalo91@gmail.com>
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */
    const iec_resolver_1 = require("./iec-resolver");
    /**
     * Exporting all IEC data types
     */
    __exportStar(require("./iec-types"), exports);
    /**
     * Converts given PLC data type declaration(s) to IEC data type.
     * - If only one declaration given, it's selected automatically.
     * - If multiple given, top-level type needs to be given as 2nd parameter.
     * - Additionally, pre-defined IEC data types can be provided as 3rd parameter {name: type}
     *
     * @param declarations PLC IEC-61131-3 struct type declarations (one or multiple)
     * @param topLevelDataType If multiple struct type declarations given, the top-level struct type name needs to be provided (= which struct should be returned as IEC type)
     * @param providedTypes Object containing struct data type names and their IEC types if required (if some structs are defined somewhere else) - like {'ST_Example': STRUCT(...)}
     * @returns IEC data type object
     */
    const fromString = (declarations, topLevelDataType, providedTypes) => {
        return iec_resolver_1.resolveIecTypes(declarations, topLevelDataType, providedTypes);
    };
    exports.fromString = fromString;

},{"./iec-resolver":2,"./iec-types":4}],2:[function(require,module,exports){
    "use strict";
    /*
    https://github.com/jisotalo/iec-61131-3
    
    Copyright (c) 2021 Jussi Isotalo <j.isotalo91@gmail.com>
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */
    var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    });
    var __importStar = (this && this.__importStar) || function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveIecTypes = void 0;
    const iecTypes = __importStar(require("./iec-types"));
    const types_1 = require("./types/types");
    /**
     * Available non-complex IEC types
     */
    const nonComplexTypes = [
        iecTypes.BOOL,
        iecTypes.BIT,
        iecTypes.USINT,
        iecTypes.BYTE,
        iecTypes.SINT,
        iecTypes.UINT,
        iecTypes.WORD,
        iecTypes.INT,
        iecTypes.DINT,
        iecTypes.UDINT,
        iecTypes.DWORD,
        iecTypes.TIME,
        iecTypes.TOD,
        iecTypes.TIME_OF_DAY,
        iecTypes.DT,
        iecTypes.DATE_AND_TIME,
        iecTypes.DATE,
        iecTypes.REAL,
        iecTypes.LREAL,
        iecTypes.ULINT,
        iecTypes.LWORD,
        iecTypes.LINT,
        iecTypes.PVOID
    ];
    /**
     * RegExp pattern for matching data type units DUTs (struct, union, alias, enum)
     */
    const typeRegEx = new RegExp(/type\s*(\w*)\s*[:]*\s*(struct|union|\(|:)\s*(.*?)(?:end_struct|end_union|;|\)\s*([^\s]*?)\s*;)\s*end_type/gis);
    /**
     * RegExp pattern for matching STRUCT variables (children)
     */
    const structVariableRegEx = new RegExp(/(\w+)\s*:\s*([^:;]*)/gis);
    /**
     * RegExp pattern for matching ENUM
     */
    const enumRegEx = new RegExp(/\s*(.+?)\s*(?::=\s*(.*?)\s*)*(?:,|$)/gis);
    /**
     * RegExp pattern for matching STRING or WSTRING types
     *  STRING (=80)
     *  WSTRING (=80)
     *  STRING(123)
     *  WSTRING(123)
     *  STRING[123]
     *  WSTRING[123]
     */
    const stringRegEx = new RegExp('^(STRING|WSTRING)([\\[\\(](.*?)[\\)\\]])*$', 'i');
    /**
     * RegExp pattern for matching ARRAY types
     */
    const arrayRegEx = new RegExp(/array\s*[\[(]+(.*?)[\])]\s*of\s*([^:;]*)/gis);
    /**
     * RegExp pattern for matching ARRAY dimensions
     * Input: "0..10", "-5..5, 0..2" etc
     */
    const arrayDimensionsRegEx = new RegExp(/(?:\s*(?:([^\.,\s]*)\s*\.\.\s*([^,\s]*))\s*)/gis);
    /**
     * Extracts struct declarations from given string containing one or multiple TYPE...END_TYPE declarations
     * @param declaration Declaration string
     * @returns Extracted data types
     */
    const extractTypeDeclarations = (declarations) => {
        const extractedTypes = [];
        let match;
        const typeMatcher = new RegExp(typeRegEx);
        //Looping until all no more declarations found
        //TODO: Add checks if RegExp was successful
        while ((match = typeMatcher.exec(declarations)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (match.index === typeMatcher.lastIndex) {
                typeMatcher.lastIndex++;
            }
            if (match.length < 5) {
                throw new Error(`Problem extracting IEC type declaration from given string. RegExp result has less than 4 matches: ${JSON.stringify(match)}`);
            }
            const type = {
                resolved: undefined
            };
            //Match 1 is the user-defined name
            type.name = match[1];
            //Match 2 provides info which type is it
            //Match 3 is the content (depends on type)
            switch (match[2].toLowerCase()) {
                //STRUCT:
                case 'struct':
                    type.type = types_1.dataTypeUnit.STRUCT;
                    type.content = extractTypeVariables(match[3]);
                    break;
                    //UNION:
                case 'union':
                    type.type = types_1.dataTypeUnit.UNION;
                    type.content = extractTypeVariables(match[3]);
                    break;
                    //ENUM:
                case '(':
                    type.type = types_1.dataTypeUnit.ENUM;
                    type.content = extractEnum(match[3], match[4]);
                    break;
                    //ALIAS:
                case ':':
                    type.type = types_1.dataTypeUnit.ALIAS;
                    type.content = {
                        dataType: match[3]
                    };
                    break;
                default:
                    throw new Error(`Problem extracting IEC data type (DUT) from given string. Found match: ${JSON.stringify(match)}`);
            }
            extractedTypes.push(type);
        }
        return extractedTypes;
    };
    /**
     * Extracts STRUCT/UNION variables (children) from given declaration string
     * @param declaration
     * @returns
     */
    const extractTypeVariables = (declaration) => {
        const extractedVariables = [];
        let match;
        const structVariableMatcher = new RegExp(structVariableRegEx);
        //TODO: Add checks if RegExp was successful
        while ((match = structVariableMatcher.exec(declaration)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (match.index === structVariableMatcher.lastIndex) {
                structVariableMatcher.lastIndex++;
            }
            extractedVariables.push({
                name: match[1],
                dataType: match[2].trim() //Removing whitespace here (TODO: with regexp?)
            });
        }
        return extractedVariables;
    };
    /**
     * Extracts ENUM from given declaration string
     * @param declaration
     * @returns
     */
    const extractEnum = (declaration, dataType) => {
        if (dataType === undefined || dataType === '')
            dataType = 'INT';
        const extractedEnum = {
            dataType,
            content: {}
        };
        let match;
        const enumMatcher = new RegExp(enumRegEx);
        const enumList = [];
        //TODO: Add checks if RegExp was successful
        while ((match = enumMatcher.exec(declaration)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (match.index === enumMatcher.lastIndex) {
                enumMatcher.lastIndex++;
            }
            let value = match[2] === undefined ? undefined : parseInt(match[2]);
            //If value is undefined, it's not provided in the ENUM
            //--> The value is previous value + 1 if available
            //Otherwise value is 0
            if (value === undefined && enumList.length > 0) {
                value = enumList[enumList.length - 1].value + 1;
            }
            else if (value === undefined) {
                value = 0;
            }
            if (value === undefined)
                throw new Error(`Problem calculating ENUM entry "${match[1]}". Found match: ${JSON.stringify(match)}`);
            //TODO: When adding support for constants edit this
            //We could have ENUM that has value := SOME_CONSTANT
            if (isNaN(value))
                throw new Error(`Problem calculating ENUM entry "${match[1]}" value from "${match[2]}". Found match: ${JSON.stringify(match)}`);
            enumList.push({
                name: match[1],
                value
            });
            extractedEnum.content[match[1]] = value;
        }
        return extractedEnum;
    };
    /**
     * Resolves given string PLC type declarations to IEC data types
     * @param declarations
     * @param topLevelDataType
     * @param providedTypes
     * @returns
     */
    const resolveIecTypes = (declarations, topLevelDataType, providedTypes) => {
        //First extracting basic type definitions from string
        const types = extractTypeDeclarations(declarations);
        //If multiple data types found, we need to know which one is the top-level
        if (!topLevelDataType && types.length > 1) {
            throw new Error('Top level data type name (topLevelDataType) is not given and multiple type declarations found. Not possible to guess.');
        }
        else if (!topLevelDataType) {
            //When only one type found, we know it's the top-level
            topLevelDataType = types[0].name;
        }
        //Resolving types to IEC data types
        for (const type of types) {
        //If already resolved, skip (happens if some other type already depended on it)
            if (type.resolved)
                continue;
            type.resolved = resolveIecDataTypeUnit(type, types, providedTypes);
        }
        //Return the top-level struct
        const returnVal = types.find(type => topLevelDataType !== undefined && type.name.toLowerCase() === topLevelDataType.toLowerCase());
        if (!returnVal) {
            throw new Error(`Top-level type ${topLevelDataType} was not found - Is data type declaration provided? Types found: ${types.map(type => type.name).join(', ')}`);
        }
        return returnVal;
    };
    exports.resolveIecTypes = resolveIecTypes;
    /**
     * Resolves single IEC data type unit from given parsed ExtractedType object
     *
     * @param type Type to be resolved
     * @param types List of all available types that are/will be resolved
     * @param providedTypes List of user-provided types
     * @returns Resolved type (IecType object)
     */
    const resolveIecDataTypeUnit = (type, types, providedTypes) => {
        switch (type.type) {
            case types_1.dataTypeUnit.STRUCT: {
                const children = {};
                for (const variable of type.content) {
                    children[variable.name] = resolveIecVariable(variable.dataType, types, providedTypes);
                }
                return iecTypes.STRUCT(children);
            }
            case types_1.dataTypeUnit.UNION: {
                //Basically 1:1 as struct
                const children = {};
                for (const variable of type.content) {
                    children[variable.name] = resolveIecVariable(variable.dataType, types, providedTypes);
                }
                return iecTypes.UNION(children);
            }
            case types_1.dataTypeUnit.ENUM: {
                const enumeration = type.content;
                //TODO: Check if valid ENUM data type
                return iecTypes.ENUM(enumeration.content, resolveIecVariable(enumeration.dataType, types, providedTypes));
            }
            case types_1.dataTypeUnit.ALIAS:
                return resolveIecVariable(type.content.dataType, types, providedTypes);
            default:
                throw new Error(`Problem resolving IEC data type unit (DUT). Unknown type: ${type.type}`);
        }
    };
    /**
     * Resolves a single variable data type (string) to IEC data type
     * Calls itself recursively if needed (like array types)
     * @param dataType Data type name as string
     * @param structs List of all available types that are/will be resolved
     * @param providedTypes List of user-provided types
     * @returns Resolved type (IecType object)
     */
    const resolveIecVariable = (dataType, types, providedTypes) => {
        //Simple non-complex data type
        let type = nonComplexTypes.find(type => type.type.toLowerCase() === dataType.toLowerCase());
        if (type) {
            return type;
        }
        //String or wstring
        //TODO: Add checks if RegExp was successful
        const stringMatcher = new RegExp(stringRegEx);
        const stringMatch = stringMatcher.exec(dataType);
        if (stringMatch) {
            if (stringMatch[1].toLowerCase() === 'string') {
                return iecTypes.STRING(stringMatch[3] ? parseInt(stringMatch[3]) : 80);
            }
            else if (stringMatch[1].toLowerCase() === 'wstring') {
                return iecTypes.WSTRING(stringMatch[3] ? parseInt(stringMatch[3]) : 80);
            }
            else {
                throw new Error(`Unknown STRING definition: "${stringMatch}"`);
            }
        }
        //Array
        //TODO: Add checks if RegExp was successful
        const arrayMatcher = new RegExp(arrayRegEx);
        const arrayMatch = arrayMatcher.exec(dataType);
        if (arrayMatch) {
            type = resolveIecVariable(arrayMatch[2], types, providedTypes);
            if (!type) {
                //This shouldn't happen
                throw new Error(`Unknown array data type "${arrayMatch[2]}"`);
            }
            //Array dimensions
            const dimensions = [];
            let match;
            const arrayDimensionsMatcher = new RegExp(arrayDimensionsRegEx);
            //TODO: Add checks if RegExp was successful
            while ((match = arrayDimensionsMatcher.exec(arrayMatch[1])) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (match.index === arrayDimensionsMatcher.lastIndex) {
                    arrayDimensionsMatcher.lastIndex++;
                }
                dimensions.push(parseInt(match[2]) - parseInt(match[1]) + 1);
            }
            return iecTypes.ARRAY(type, dimensions);
        }
        //Data type unit (DUT) like struct, enum etc. (or unknown)
        const dataTypeUnit = types.find(type => type.name.toLowerCase() == dataType.toLowerCase());
        if (dataTypeUnit) {
            //If type is found but not yet resolved, resolve it now
            if (!dataTypeUnit.resolved) {
                dataTypeUnit.resolved = resolveIecDataTypeUnit(dataTypeUnit, types, providedTypes);
            }
            return dataTypeUnit.resolved;
        }
        else {
            //Data type was unknown. Was it provided already?
            if (providedTypes) {
                const key = Object.keys(providedTypes).find(key => key.toLowerCase() === dataType.toLowerCase());
                if (key) {
                    return providedTypes[key];
                }
                else {
                    throw new Error(`Unknown data type "${dataType}" found! Types found from declaration: ${types.map(type => type.name).join(', ')}, types provided separately: ${Object.keys(providedTypes).join(',')}`);
                }
            }
            else {
                throw new Error(`Unknown data type "${dataType}" found! Types found from declaration: ${types.map(type => type.name).join(', ')}`);
            }
        }
    };

},{"./iec-types":4,"./types/types":5}],3:[function(require,module,exports){
    "use strict";
    /*
    https://github.com/jisotalo/iec-61131-3
    
    Copyright (c) 2021 Jussi Isotalo <j.isotalo91@gmail.com>
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PVOID = exports.LINT = exports.LWORD = exports.ULINT = exports.LREAL = exports.REAL = exports.DATE = exports.DATE_AND_TIME = exports.DT = exports.TIME_OF_DAY = exports.TOD = exports.TIME = exports.DWORD = exports.UDINT = exports.DINT = exports.INT = exports.WORD = exports.UINT = exports.SINT = exports.BYTE = exports.USINT = exports.BIT = exports.BOOL = exports.WSTRING = exports.STRING = exports.ENUM = exports.ARRAY = exports.UNION = exports.STRUCT = void 0;
    /**
     * Base abstract type
     */
    class TypeBase {
        constructor() {
            this.type = '';
            this.byteLength = 0;
        }
        /**
         * Shorthand for variableIterator()
         * --> for(const variable of dataType) {...}
         */
        *[Symbol.iterator]() {
            let startIndex = 0;
            //Helper recursive function
            function* iterate(dt) {
                if (dt.children === undefined) {
                    yield {
                        name: undefined,
                        startIndex,
                        type: dt
                    };
                    startIndex += dt.byteLength;
                }
                else {
                    for (const name in dt.children) {
                        const type = dt.children[name];
                        if (type.children !== undefined) {
                            //There are children -> go deeper
                            yield* iterate(type);
                        }
                        else {
                            yield {
                                name,
                                startIndex,
                                type
                            };
                            startIndex += type.byteLength;
                        }
                    }
                }
            }
            yield* iterate(this);
        }
        /**
         * Iterator for looping through all variables in memory order
         * NOTE: Array variable is _one_ variable, see elementIterator() for looping each array element
         *
         * Usage: for(const variable of dataType.variableIterator()) {...}
         * Shorthand for this is: for(const variable of dataType) {...}
         */
        *variableIterator() {
            yield* this[Symbol.iterator]();
        }
        /**
         * Iterator for looping through all variables (and their array elements) in memory order
         * NOTE: Each array element is yield separately unlike with variableIterator()
         *
         * Usage: for(const variable of dataType.elementIterator()) {...}
         *
         */
        *elementIterator() {
            function* iterateArrayLevel(dt, startIndex, name) {
                for (let i = 0; i < dt.totalSize; i++) {
                    if (dt.dataType instanceof ARRAY) {
                        yield* iterateArrayLevel(dt.dataType, startIndex + dt.dataType.byteLength * i, `${name}[${i}]`);
                    }
                    else {
                        yield {
                            name: `${name}[${i}]`,
                            startIndex: startIndex + dt.dataType.byteLength * i,
                            type: dt.dataType
                        };
                    }
                }
            }
            for (const variable of this) {
                if (variable.type instanceof ARRAY) {
                    yield* iterateArrayLevel(variable.type, variable.startIndex, variable.name);
                }
                else {
                    yield variable;
                }
            }
        }
    }
    /**
     * IEC 61131-3 type: STRUCT
     */
    class STRUCT extends TypeBase {
        constructor(children) {
            super();
            this.type = 'STRUCT';
            this.children = children;
            //Calculating struct size
            for (const key in this.children) {
                if (typeof this.children[key] !== 'object' || this.children[key].byteLength === undefined) {
                    throw new Error(`Struct member ${key} is not valid IEC data type - Did you remember to use () with some data types that require it (example with STRING())?`);
                }
                this.byteLength += this.children[key].byteLength;
            }
        }
        getDefault() {
            const obj = {};
            for (const key in this.children) {
                obj[key] = this.children[key].getDefault();
            }
            return obj;
        }
    }
    exports.STRUCT = STRUCT;
    /**
     * IEC 61131-3 type: UNION
     */
    class UNION extends TypeBase {
        constructor(children) {
            super();
            this.type = 'UNION';
            this.children = children;
            //Calculating union size (= biggest child)
            for (const key in this.children) {
                if (typeof this.children[key] !== 'object' || this.children[key].byteLength === undefined) {
                    throw new Error(`Struct member ${key} is not valid IEC data type - Did you remember to use () with some data types that require it (example with STRING())?`);
                }
                if (this.children[key].byteLength > this.byteLength)
                    this.byteLength = this.children[key].byteLength;
            }
        }
        getDefault() {
            const obj = {};
            for (const key in this.children) {
                obj[key] = this.children[key].getDefault();
            }
            return obj;
        }
    }
    exports.UNION = UNION;
    /**
     * IEC 61131-3 type: ARRAY
     * Handles 1..3 dimensional arrays
     */
    class ARRAY extends TypeBase {
        /**
         * Constructor for array
         * @param dataType Data type of the array (example: iec.INT)
         * @param dimensions If 1-dimensional array: Array dimension (size) as number. If multi-dimensional array, array dimensions as array (like [1, 10, 5])
         */
        constructor(dataType, dimensions) {
            super();
            this.type = 'ARRAY';
            this.dimensions = [];
            this.totalSize = 0;
            this.dataType = dataType;
            if (Array.isArray(dimensions)) {
                this.dimensions = dimensions;
            }
            else {
                this.dimensions.push(dimensions);
            }
            //Calculating total size
            this.totalSize = this.dimensions.reduce((total, size) => total * size, 1);
            this.byteLength = this.totalSize * dataType.byteLength;
        }
        getDefault() {
            //Recursive parsing of array dimensions
            //Loops dimensions until we found the last one and then fills with data
            const parseArray = (arrayDimension) => {
                const result = [];
                for (let dimension = 0; dimension < this.dimensions[arrayDimension]; dimension++) {
                    if (this.dimensions[arrayDimension + 1]) {
                        //More dimensions available -> go deeper
                        result.push(parseArray(arrayDimension + 1));
                    }
                    else {
                        //This is the final dimension -> we have actual data
                        result.push(this.dataType.getDefault());
                    }
                }
                return result;
            };
            //Start from 1st dimension
            return parseArray(0);
        }
    }
    exports.ARRAY = ARRAY;
    /**
     * IEC 61131-3 type: ENUM
     */
    class ENUM extends TypeBase {
        constructor(definition, dataType) {
            super();
            this.type = 'ENUM';
            this.definition = definition;
            this.dataType = dataType ? dataType : new INT();
            this.byteLength = this.dataType.byteLength;
        }
        getDefault() {
            //Codeys initializes the value with the first enumeration component
            //Use it, unless there are none
            const keys = Object.keys(this.definition);
            if (keys.length > 0) {
                return {
                    name: keys[0],
                    value: this.definition[keys[0]]
                };
            }
            else {
                //No entries? Use data type default value
                const value = this.dataType.getDefault();
                //Do we have enumeration entry for default value?
                const entry = this.findEnumEntryByValue(value);
                if (entry)
                    return entry;
                //Not found
                return {
                    name: undefined,
                    value
                };
            }
        }
        findEnumEntryByString(text) {
            if (typeof this.definition[text] !== 'undefined') {
                //Found
                return {
                    name: text,
                    value: this.definition[text]
                };
            }
            //Not found
            return undefined;
        }
        findEnumEntryByValue(value) {
            for (const key in this.definition) {
                if (this.definition[key] === value) {
                    //Found
                    return {
                        name: key,
                        value: value
                    };
                }
            }
            //Not found
            return undefined;
        }
    }
    exports.ENUM = ENUM;
    /**
     * IEC 61131-3 type: STRING
     * Default length 80 characters
     */
    class STRING extends TypeBase {
        /**
         * Constructor for string
         * @param length Length of the string variable (similar as in the PLC), default is 80
         */
        constructor(length = 80) {
            super();
            this.type = 'STRING';
            this.byteLength = 80;
            //Adding string end delimeter
            this.byteLength = length + 1;
        }
            getDefault() {
                return '';
            }
        }
        exports.STRING = STRING;
        /**
         * IEC 61131-3 type: WSTRING
         * Default length 80 characters
         */
        class WSTRING extends TypeBase {
            /**
             * Constructor for wstring
             * @param length Length of the string variable (similar as in the PLC), default is 80
             */
            constructor(length = 80) {
            super();
            this.type = 'WSTRING';
            this.byteLength = 160;
            //Adding string end delimeter
            this.byteLength = length * 2 + 2;
        }
        getDefault() {
            return '';
        }
    }
    exports.WSTRING = WSTRING;
    /**
     * IEC 61131-3 type: BOOL (1 byte)
     */
    class BOOL extends TypeBase {
        constructor() {
            super(...arguments);
            this.type = 'BOOL';
            this.byteLength = 1;
        }
        getDefault() {
            return false;
        }
    }
    exports.BOOL = BOOL;
    /**
     * IEC 61131-3 type: BOOL (1 byte)
     */
    class BIT extends TypeBase {
        constructor() {
            super(...arguments);
            this.type = 'BIT';
            this.byteLength = 1 / 8;
        }
        getDefault() {
            return false;
        }
    }
    exports.BIT = BIT;
    /**
     * IEC 61131-3 type: USINT (1 byte)
     */
    class USINT extends TypeBase {
        constructor() {
            super(...arguments);
            this.type = 'USINT';
            this.byteLength = 1;
            this.min = 0;
            this.max = 255;
        }
        getDefault() {
            return 0;
        }
    }
    exports.USINT = USINT;
    /**
     * IEC 61131-3 type: BYTE (1 byte)
     */
    class BYTE extends USINT {
        constructor() {
            super(...arguments);
            this.type = 'BYTE';
        }
    }
    exports.BYTE = BYTE;
    /**
     * IEC 61131-3 type: SINT (1 byte)
     */
    class SINT extends TypeBase {
        constructor() {
            super(...arguments);
            this.type = 'SINT';
            this.byteLength = 1;
            this.min = -128;
            this.max = 127;
        }
        getDefault() {
            return 0;
        }
    }
    exports.SINT = SINT;
    /**
     * IEC 61131-3 type: UINT (2 bytes)
     */
    class UINT extends TypeBase {
        constructor() {
            super(...arguments);
            this.type = 'UINT';
            this.byteLength = 2;
            this.min = 0;
            this.max = 65535;
        }
        getDefault() {
            return 0;
        }
    }
    exports.UINT = UINT;
    /**
     * IEC 61131-3 type: WORD (2 bytes)
     */
    class WORD extends UINT {
        constructor() {
            super(...arguments);
            this.type = 'WORD';
        }
    }
    exports.WORD = WORD;
    /**
     * IEC 61131-3 type: INT (2 bytes)
     */
    class INT extends TypeBase {
        constructor() {
            super(...arguments);
            this.type = 'INT';
            this.byteLength = 2;
            this.min = -32768;
            this.max = 32767;
        }
        getDefault() {
            return 0;
        }
    }
    exports.INT = INT;
    /**
     * IEC 61131-3 type: DINT (4 bytes)
     */
    class DINT extends TypeBase {
        constructor() {
            super(...arguments);
            this.type = 'DINT';
            this.byteLength = 4;
            this.min = -2147483648;
            this.max = 2147483647;
        }
        getDefault() {
            return 0;
        }
    }
    exports.DINT = DINT;
    /**
     * IEC 61131-3 type: UDINT (4 bytes)
     */
    class UDINT extends TypeBase {
        constructor() {
            super(...arguments);
            this.type = 'UDINT';
            this.byteLength = 4;
            this.min = 0;
            this.max = 4294967295;
        }
        getDefault() {
            return 0;
        }
    }
    exports.UDINT = UDINT;
    /**
     * IEC 61131-3 type: DWORD (4 bytes)
     */
    class DWORD extends UDINT {
        constructor() {
            super(...arguments);
            this.type = 'DWORD';
        }
    }
    exports.DWORD = DWORD;
    /**
     * IEC 61131-3 type: TIME (4 bytes)
     */
    class TIME extends UDINT {
        constructor() {
            super(...arguments);
            this.type = 'TIME';
        }
    }
    exports.TIME = TIME;
    /**
     * IEC 61131-3 type: TOD (4 bytes)
     */
    class TOD extends UDINT {
        constructor() {
            super(...arguments);
            this.type = 'TOD';
        }
    }
    exports.TOD = TOD;
    /**
     * IEC 61131-3 type: TIME_OF_DAY (4 bytes)
     */
    class TIME_OF_DAY extends TOD {
        constructor() {
            super(...arguments);
            this.type = 'TIME_OF_DAY';
        }
    }
    exports.TIME_OF_DAY = TIME_OF_DAY;
    /**
     * IEC 61131-3 type: DT (4 bytes)
     * TODO: Conversion to Javascript Date object?
     */
    class DT extends UDINT {
        constructor() {
            super(...arguments);
            this.type = 'DT';
        }
    }
    exports.DT = DT;
    /**
     * IEC 61131-3 type: DATE_AND_TIME (4 bytes)
     * TODO: Conversion to Javascript Date object?
     */
    class DATE_AND_TIME extends DT {
        constructor() {
            super(...arguments);
            this.type = 'DATE_AND_TIME';
        }
    }
    exports.DATE_AND_TIME = DATE_AND_TIME;
    /**
     * IEC 61131-3 type: DATE (4 bytes)
     * TODO: Conversion to Javascript Date object?
     */
    class DATE extends UDINT {
        constructor() {
            super(...arguments);
            this.type = 'DATE';
        }
    }
    exports.DATE = DATE;
    /**
     * IEC 61131-3 type: REAL (4 bytes)
     */
    class REAL extends TypeBase {
        constructor() {
            super(...arguments);
            this.type = 'REAL';
            this.byteLength = 4;
            this.min = -3.402823e+38;
            this.max = 3.402823e+38;
        }
        getDefault() {
            return 0;
        }
    }
    exports.REAL = REAL;
    /**
     * IEC 61131-3 type: LREAL (4 bytes)
     */
    class LREAL extends TypeBase {
        constructor() {
            super(...arguments);
            this.type = 'LREAL';
            this.byteLength = 8;
            this.min = -1.7976931348623158e+308;
            this.max = 1.7976931348623158e+308;
        }
        getDefault() {
            return 0;
        }
    }
    exports.LREAL = LREAL;
    /**
     * IEC 61131-3 type: ULINT (8 bytes)
     * TODO: Requires Node.js that supports BigInt
     */
    class ULINT extends TypeBase {
        constructor() {
            super(...arguments);
            this.type = 'ULINT';
            this.byteLength = 8;
            this.min = 0;
            this.max = 1.8446744e+19;
        }
        getDefault() {
            return 0;
        }
    }
    exports.ULINT = ULINT;
    /**
     * IEC 61131-3 type: LWORD (8 bytes)
     * TODO: Requires Node.js that supports BigInt
     */
    class LWORD extends ULINT {
        constructor() {
            super(...arguments);
            this.type = 'LWORD';
        }
    }
    exports.LWORD = LWORD;
    /**
     * IEC 61131-3 type: LINT (8 bytes)
     * TODO: Requires Node.js that supports BigInt
     */
    class LINT extends TypeBase {
        constructor() {
            super(...arguments);
            this.type = 'LINT';
            this.byteLength = 8;
            this.min = -9.223372e+18;
            this.max = 9.223372e+18;
        }
        getDefault() {
            return 0;
        }
    }
    exports.LINT = LINT;
    /**
     * IEC 61131-3 type: LINT (8 bytes)
     * TODO: Requires Node.js that supports BigInt
     */
    class PVOID extends TypeBase {
        constructor() {
            super(...arguments);
            this.type = 'PVOID';
            this.byteLength = 8;
        }
        getDefault() {
            return 0;
        }
    }
    exports.PVOID = PVOID;
    /**
     * Trims the given PLC string until end mark (\0, 0 byte) is found
     * (= removes empty bytes from end of the string)
     * @param {string} plcString String to trim
     *
     * @returns {string} Trimmed string
     */
    const trimPlcString = (plcString) => {
        let parsedStr = '';
        for (let i = 0; i < plcString.length; i++) {
            if (plcString.charCodeAt(i) === 0)
                break;
            parsedStr += plcString[i];
        }
        return parsedStr;
    };

},{}],4:[function(require,module,exports){
    "use strict";
    /*
    https://github.com/jisotalo/iec-61131-3
    
    Copyright (c) 2021 Jussi Isotalo <j.isotalo91@gmail.com>
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */
    var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    });
    var __importStar = (this && this.__importStar) || function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PVOID = exports.LINT = exports.LWORD = exports.ULINT = exports.LREAL = exports.REAL = exports.DATE = exports.DATE_AND_TIME = exports.DT = exports.TIME_OF_DAY = exports.TOD = exports.TIME = exports.DWORD = exports.UDINT = exports.DINT = exports.INT = exports.WORD = exports.UINT = exports.SINT = exports.BYTE = exports.USINT = exports.BIT = exports.BOOL = exports.WSTRING = exports.STRING = exports.ENUM = exports.ARRAY = exports.UNION = exports.STRUCT = void 0;
    const handler = __importStar(require("./iec-type-handler"));
    /**
     * IEC 61131-3 type: STRUCT - Handles STRUCT data type, provide struct children as object
     *
     * @param children Children variables as IEC object, like: `{intVal: INT, boolVal: BOOL, structVal: STRUCT({...})}`
     * @returns IecType object
     */
    const STRUCT = (children) => new handler.STRUCT(children);
    exports.STRUCT = STRUCT;
    /**
     * IEC 61131-3 type: UNION - Handles UNION data type, provide union children as object
     *
     * @param children Children variables as IEC object, like: `{intVal: INT, boolVal: BOOL, structVal: STRUCT({...})}`
     * @returns IecType object
     */
    const UNION = (children) => new handler.UNION(children);
    exports.UNION = UNION;
    /**
     * IEC 61131-3 type: ARRAY - Handles 1..3 dimensional arrays.
     *
     * Example with 1-dimensional INT array of 10 values: `ARRAY(INT, 10)`
    
     * Example with 2-dimensional REAL array of 2*5 values: `ARRAY(REAL, [2, 5])`
     *
     * @param dataType Data type of the array (example: INT)
     * @param dimensions Array dimension as number (if 1-dimensional array). If multi-dimensional, array dimensions as array of numbers (like `[2, 5]`)
     */
    const ARRAY = (dataType, dimensions) => new handler.ARRAY(dataType, dimensions);
    exports.ARRAY = ARRAY;
    /**
     * IEC 61131-3 type: ENUM
     * Handles enumeration types with different data types
     *
     * @param definition Enumeration definition as object (like `{key1: 1, key2: 2}`)
     * @param dataType Data type of the ENUM (default is iec.INT)
     * @returns
     */
    const ENUM = (definition, dataType) => new handler.ENUM(definition, dataType);
    exports.ENUM = ENUM;
    /**
     * IEC 61131-3 type: STRING - Default length 80 characters
     * @param length Length of the string variable (similar as in the PLC), default is 80
     */
    const STRING = (length) => new handler.STRING(length);
    exports.STRING = STRING;
    /**
     * IEC 61131-3 type: WSTRING - Default length 80 characters
     * @param length Length of the string variable (similar as in the PLC), default is 80
     */
    const WSTRING = (length) => new handler.WSTRING(length);
    exports.WSTRING = WSTRING;
    /**
     * IEC 61131-3 type: BOOL (1 byte)
     */
    exports.BOOL = new handler.BOOL();
    /**
     * IEC 61131-3 type: BOOL (1 bit)
     */
    exports.BIT = new handler.BIT();
    /**
     * IEC 61131-3 type: USINT (1 byte)
     */
    exports.USINT = new handler.USINT();
    /**
     * IEC 61131-3 type: BYTE (1 byte)
     */
    exports.BYTE = new handler.BYTE();
    /**
     * IEC 61131-3 type: SINT (1 byte)
     */
    exports.SINT = new handler.SINT();
    /**
     * IEC 61131-3 type: UINT (2 bytes)
     */
    exports.UINT = new handler.UINT();
    /**
     * IEC 61131-3 type: WORD (2 bytes)
     */
    exports.WORD = new handler.WORD();
    /**
     * IEC 61131-3 type: INT (2 bytes)
     */
    exports.INT = new handler.INT();
    /**
     * IEC 61131-3 type: DINT (4 bytes)
     */
    exports.DINT = new handler.DINT();
    /**
     * IEC 61131-3 type: UDINT (4 bytes)
     */
    exports.UDINT = new handler.UDINT();
    /**
     * IEC 61131-3 type: DWORD (4 bytes)
     */
    exports.DWORD = new handler.DWORD();
    /**
     * IEC 61131-3 type: TIME (4 bytes)
     */
    exports.TIME = new handler.TIME();
    /**
     * IEC 61131-3 type: TOD (4 bytes)
     */
    exports.TOD = new handler.TOD();
    /**
     * IEC 61131-3 type: TIME_OF_DAY (4 bytes)
     */
    exports.TIME_OF_DAY = new handler.TIME_OF_DAY();
    /**
     * IEC 61131-3 type: DT (4 bytes)
     * TODO: Conversion to Javascript Date object?
     */
    exports.DT = new handler.DT();
    /**
     * IEC 61131-3 type: DATE_AND_TIME (4 bytes)
     * TODO: Conversion to Javascript Date object?
     */
    exports.DATE_AND_TIME = new handler.DATE_AND_TIME();
    /**
     * IEC 61131-3 type: DATE (4 bytes)
     * TODO: Conversion to Javascript Date object?
     */
    exports.DATE = new handler.DATE();
    /**
     * IEC 61131-3 type: REAL (4 bytes)
     */
    exports.REAL = new handler.REAL();
    /**
     * IEC 61131-3 type: LREAL (4 bytes)
     */
    exports.LREAL = new handler.LREAL();
    /**
     * IEC 61131-3 type: ULINT (8 bytes)
     * TODO: Requires Node.js that supports BigInt
     */
    exports.ULINT = new handler.ULINT();
    /**
     * IEC 61131-3 type: LWORD (8 bytes)
     * TODO: Requires Node.js that supports BigInt
     */
    exports.LWORD = new handler.LWORD();
    /**
     * IEC 61131-3 type: LINT (8 bytes)
     * TODO: Requires Node.js that supports BigInt
     */
    exports.LINT = new handler.LINT();
    /**
     * IEC 61131-3 type: PVOID (x bytes)
     * TODO:
     */
    exports.PVOID = new handler.PVOID();

},{"./iec-type-handler":3}],5:[function(require,module,exports){
    "use strict";
    /*
    https://github.com/jisotalo/iec-61131-3
    
    Copyright (c) 2021 Jussi Isotalo <j.isotalo91@gmail.com>
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
    */
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dataTypeUnit = void 0;
    /**
     * Different data type units (DUT) as enumeration
     */
    var dataTypeUnit;
    (function (dataTypeUnit) {
        dataTypeUnit["STRUCT"] = "STRUCT";
        dataTypeUnit["UNION"] = "UNION";
        dataTypeUnit["ENUM"] = "ENUM";
        dataTypeUnit["ALIAS"] = "ALIAS";
    })(dataTypeUnit = exports.dataTypeUnit || (exports.dataTypeUnit = {}));

},{}],6:[function(require,module,exports){
    (function (global){(function (){
        const iec = require("../dist/iec-61131-3");

        global.window.iec = iec;
    }).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../dist/iec-61131-3":1}]},{},[6]);
