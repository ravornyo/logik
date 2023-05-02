grammar Logik

entry Program:
    (variables+=Variable)*;

Variable:
    (name=ID ('=' expression=Expression ) | (expression=Expression '=' ) name=ID ) ';';

Expression:
    (Or | BINARY) ({infer NotLogic} '\'')? ;

Or infers Expression:
    And ({infer OrLogic.inputs+=current} '+' inputs+=And)*;

And infers Expression:
    PrimaryExpression ({infer AndLogic.inputs+=current} ('*' | 'x' | 'X') inputs+=PrimaryExpression)*;

PrimaryExpression infers Expression:
    ('(' Expression ')'({infer NotLogic.input=current} '\'')? | {infer Variable} name=ID ({infer NotLogic.input=current} '\'')?);

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z0-9][\w_]*/;
terminal BINARY returns number: /[0-1]+/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: ('//'|'#') !('\n'|'\r')* ('\r'? '\n')?;
