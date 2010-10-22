TAO_MATCHING = typeof TAO_MATCHING != 'undefined' ? TAO_MATCHING : {};

/*
 * Matching template rules
 */
TAO_MATCHING.RULE = typeof TAO_MATCHING.RULE != 'undefined' ? TAO_MATCHING.RULE : {};

TAO_MATCHING.RULE.MATCH_CORRECT = "if(match(getResponse('RESPONSE'), getCorrect('RESPONSE'))) setOutcomeValue('SCORE', 1); else setOutcomeValue('SCORE', 0);"; 
TAO_MATCHING.RULE.MAP_RESPONSE = "if(isNull(getResponse('RESPONSE'))) { setOutcomeValue('SCORE', 0); } else { setOutcomeValue('SCORE', mapResponse(getMap('RESPONSE'), getResponse('RESPONSE'))); }";