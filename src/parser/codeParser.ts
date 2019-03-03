import { parse, ParserOptions } from "@babel/parser";

const testTokens = ["describe", "it", "test"];

function codeParser(sourceCode) {
  const parserOptions: ParserOptions = {
    plugins: ["jsx", "typescript"],
    sourceType: "module",
    tokens: true
  };
  const ast = parse(sourceCode, parserOptions);

  return ast.tokens
    .map(({ value, loc, type }, index) => {
      if (testTokens.indexOf(value) === -1) {
        return;
      }
      if (type.label !== "name") {
        return;
      }
      const nextToken = ast.tokens[index + 1];
      if (!nextToken.type.startsExpr) {
        return;
      }

      let testNameToken;

      const currentToken = ast.tokens[index + 2];

      if (currentToken.value === undefined && currentToken.type.label === "`") {
        testNameToken = ast.tokens[index + 3];
      } else {
        testNameToken = ast.tokens[index + 2];
      }

      return {
        loc,
        testName: testNameToken.value
      };
    })
    .filter(Boolean);
}

export { codeParser };
