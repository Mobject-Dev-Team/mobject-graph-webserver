// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />
class DefaultNodeClassFactory {

    constructor(graph) {

        this.graph = graph;

        this.inputPortFactories = [];
        this.outputPortFactories = [];
        this.propertyFactories = [];
        this.contentFactories = [];

        this.defaultInputPortFactory = new DefaultInputPortFactory(graph);

    }

    createNodeClass(blueprint) {

        if (!this.isValidBlueprint(blueprint)) { return }

        console.log('Creating node:', blueprint.name);

        const name = blueprint.name;
        const inputs = blueprint.inputs || [];
        const outputs = blueprint.outputs || [];
        const properties = blueprint.properties || [];
        const constants = blueprint.constants || [];

        const constructorFunctions = [];

        function createConstructorFunctions(sections, factories, defaultFactory) {

            return sections.map(function (section) {

                for (let i = 0; i < factories.length; i++) {

                    let constructorFunction = factories[i].CreateFromBlueprint(section);
                    if (constructorFunction) { return constructorFunction };
                }

                return defaultFactory.CreateFromBlueprint(section);

            })

        }
        
        //constructorFunctions.push(createConstructorFunctions(inputs, this.inputPortFactories, this.defaultInputPortFactory));
        //constructorFunctions.push(createConstructorFunctions(outputs, this.outputPortFactories, this.defaultOuputPortFactory));
        //constructorFunctions.push(createConstructorFunctions(properties, this.propertyFactories, this.defaultPropertyFactory));
        //constructorFunctions.push(createConstructorFunctions(constants, this.contentFactories, this.defaultContentFactory));

        // actual class which will be returned.
        return class CreatedNode extends NodeBase {    
            constructor() {      
                super(name);

                this.constructorFunctions = constructorFunctions;
                this.postConstructorFunctions = [];

                const _this = this;

                constructorFunctions.map(func => {
                    if (typeof func === 'function') {
                        func.call(_this);
                    } else {
                        console.log(`${func} is not a function`);
                    }
                });


                // implement this via events... 
                //// now run all post constructor functions
                //postConstructorFunctions.map(func => func.call(_this));

            }  
        };

    };

    isValidBlueprint(blueprint) {

        try {

            if (!blueprint) throw new Error("Blueprint cannot be empty");

            if (!blueprint.name) throw new Error("Blueprint must contain a name");

            // Put any non-optional blueprint checks here.

            return true;

        } catch (err) {

            console.error(err);

        }
    }
}
