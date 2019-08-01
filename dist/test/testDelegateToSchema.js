/* tslint:disable:no-unused-expression */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var graphql_1 = require("graphql");
var testingSchemas_1 = require("./testingSchemas");
var delegateToSchema_1 = require("../stitching/delegateToSchema");
var mergeSchemas_1 = require("../stitching/mergeSchemas");
function findPropertyByLocationName(properties, name) {
    for (var _i = 0, _a = Object.keys(properties); _i < _a.length; _i++) {
        var key = _a[_i];
        var property = properties[key];
        if (property.location.name === name) {
            return property;
        }
    }
}
var COORDINATES_QUERY = "\n  query BookingCoordinates($bookingId: ID!) {\n    bookingById (id: $bookingId) {\n      property {\n        location {\n          coordinates\n        }\n      }\n    }\n  }\n";
function proxyResolvers(spec) {
    return {
        Booking: {
            property: {
                fragment: '... on Booking { propertyId }',
                resolve: function (booking, args, context, info) {
                    var delegateFn = spec === 'standalone' ? delegateToSchema_1.default :
                        info.mergeInfo.delegateToSchema;
                    return delegateFn({
                        schema: testingSchemas_1.propertySchema,
                        operation: 'query',
                        fieldName: 'propertyById',
                        args: { id: booking.propertyId },
                        context: context,
                        info: info
                    });
                }
            }
        },
        Location: {
            coordinates: {
                fragment: '... on Location { name }',
                resolve: function (location, args, context, info) {
                    var name = location.name;
                    return findPropertyByLocationName(testingSchemas_1.sampleData.Property, name)
                        .location.coordinates;
                }
            }
        }
    };
}
var proxyTypeDefs = "\n  extend type Booking {\n    property: Property!\n  }\n  extend type Location {\n    coordinates: String!\n  }\n";
describe('stitching', function () {
    describe('delegateToSchema', function () {
        ['standalone', 'info.mergeInfo'].forEach(function (spec) {
            context(spec, function () {
                var schema;
                before(function () {
                    schema = mergeSchemas_1.default({
                        schemas: [testingSchemas_1.bookingSchema, testingSchemas_1.propertySchema, proxyTypeDefs],
                        resolvers: proxyResolvers(spec)
                    });
                });
                it('should add fragments for deep types', function () { return __awaiter(_this, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, graphql_1.graphql(schema, COORDINATES_QUERY, {}, {}, { bookingId: 'b1' })];
                            case 1:
                                result = _a.sent();
                                chai_1.expect(result).to.deep.equal({
                                    data: {
                                        bookingById: {
                                            property: {
                                                location: {
                                                    coordinates: testingSchemas_1.sampleData.Property.p1.location.coordinates
                                                }
                                            }
                                        }
                                    }
                                });
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
        });
    });
});
//# sourceMappingURL=testDelegateToSchema.js.map