Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var graphql_1 = require("graphql");
var extractExtensionDefinitions_1 = require("../generate/extractExtensionDefinitions");
require("mocha");
describe('Extension extraction', function () {
    it('extracts extended inputs', function () {
        var typeDefs = "\n      input Input {\n        foo: String\n      }\n\n      extend input Input {\n        bar: String\n      }\n    ";
        var astDocument = graphql_1.parse(typeDefs);
        var extensionAst = extractExtensionDefinitions_1.default(astDocument);
        chai_1.expect(extensionAst.definitions).to.have.length(1);
        chai_1.expect(extensionAst.definitions[0].kind).to.equal('InputObjectTypeExtension');
    });
    it('extracts extended unions', function () {
        var typeDefs = "\n      type Person {\n        name: String!\n      }\n      type Location {\n        name: String!\n      }\n      union Searchable = Person | Location\n\n      type Post {\n        name: String!\n      }\n      extend union Searchable = Post\n    ";
        var astDocument = graphql_1.parse(typeDefs);
        var extensionAst = extractExtensionDefinitions_1.default(astDocument);
        chai_1.expect(extensionAst.definitions).to.have.length(1);
        chai_1.expect(extensionAst.definitions[0].kind).to.equal('UnionTypeExtension');
    });
    it('extracts extended enums', function () {
        var typeDefs = "\n      enum Color {\n        RED\n        GREEN\n      }\n\n      extend enum Color {\n        BLUE\n      }\n    ";
        var astDocument = graphql_1.parse(typeDefs);
        var extensionAst = extractExtensionDefinitions_1.default(astDocument);
        chai_1.expect(extensionAst.definitions).to.have.length(1);
        chai_1.expect(extensionAst.definitions[0].kind).to.equal('EnumTypeExtension');
    });
});
//# sourceMappingURL=testExtensionExtraction.js.map