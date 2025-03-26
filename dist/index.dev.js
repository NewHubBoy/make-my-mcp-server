"use strict";

var _express = _interopRequireDefault(require("express"));

var _mcp = require("@modelcontextprotocol/sdk/server/mcp.js");

var _sse = require("@modelcontextprotocol/sdk/server/sse.js");

var _zod = require("zod");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var server = new _mcp.McpServer({
  name: "demo-sse",
  version: "1.0.0"
});
server.tool("exchange", '人民币汇率换算', {
  rmb: _zod.z.number()
}, function _callee(_ref) {
  var rmb, usdRate, hkdRate, usd, hkd;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          rmb = _ref.rmb;
          // 使用固定汇率进行演示，实际应该调用汇率API
          usdRate = 0.14; // 1人民币约等于0.14美元

          hkdRate = 1.09; // 1人民币约等于1.09港币

          usd = (rmb * usdRate).toFixed(2);
          hkd = (rmb * hkdRate).toFixed(2);
          return _context.abrupt("return", {
            content: [{
              type: "text",
              text: "".concat(rmb, "\u4EBA\u6C11\u5E01\u7B49\u4E8E:\n").concat(usd, "\u7F8E\u5143\n").concat(hkd, "\u6E2F\u5E01")
            }]
          });

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
});
var app = (0, _express["default"])();
var sessions = {};
app.get("/sse", function _callee2(req, res) {
  var sseTransport, sessionId;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log("New SSE connection from ".concat(req.ip));
          sseTransport = new _sse.SSEServerTransport("/messages", res);
          sessionId = sseTransport.sessionId;

          if (sessionId) {
            sessions[sessionId] = {
              transport: sseTransport,
              response: res
            };
          }

          _context2.next = 6;
          return regeneratorRuntime.awrap(server.connect(sseTransport));

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
});
app.post("/messages", function _callee3(req, res) {
  var sessionId, session;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          sessionId = String(req.query.sessionId);
          session = sessions[sessionId];

          if (session) {
            _context3.next = 5;
            break;
          }

          res.status(404).send("Session not found");
          return _context3.abrupt("return");

        case 5:
          _context3.next = 7;
          return regeneratorRuntime.awrap(session.transport.handlePostMessage(req, res));

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
});
console.log("Server started at http://localhost:3001");
app.listen(3001);