import {Game, testingGetState} from "./server";
import * as assert from "assert";
import {testingSetShuffler} from "./game";
import {BidValue, Call, Card} from "./common";
import _ from "lodash";
import {PlayingBoardState} from "./state";

const createTimer = () => {
    let logical_clock = 0;
    return () => logical_clock++
};

const sample_deal = {
    dog: [
        [ "T", 19 ], [ "H", 4 ], [ "D", 4 ]
    ] as Card[],
    hands: [
        [
            [ "C", 3 ], [ "C", "D" ],
            [ "D", 5 ], [ "D", 6 ], [ "D", "V" ], [ "D", "D" ], [ "D", "R" ],
            [ "H", 5 ],
            [ "S", 1 ], [ "S", 9 ], [ "S", "V" ], [ "S", "C" ],
            [ "T", 7 ], [ "T", 12 ], [ "T", 18 ]
        ],
        [
            [ "C", 10 ],
            [ "D", 1 ], [ "D", 3 ], [ "D", 10 ],
            [ "H", 1 ], [ "H", 2 ], [ "H", 3 ], [ "H", "R" ],
            [ "S", 2 ], [ "S", 3 ], [ "S", 8 ], [ "S", "R" ],
            [ "T", 6 ], [ "T", 8 ], [ "T", 21 ]
        ],
        [
            [ "C", 1 ], [ "C", 4 ], [ "C", 7 ], [ "C", 8 ],
            [ "C", "V" ], [ "C", "R" ],
            [ "D", 9 ], [ "D", "C" ],
            [ "H", 10 ], [ "H", "V" ],
            [ "S", 4 ],
            [ "T", 4 ], [ "T", 9 ], [ "T", 11 ], [ "T", 16 ]
        ],
        [
            [ "C", 2 ], [ "C", 9 ],
            [ "D", 2 ], [ "D", 7 ],
            [ "H", 6 ], [ "H", 7 ], [ "H", "C" ],
            [ "S", 5 ], [ "S", 6 ], [ "S", 7 ], [ "S", 10 ], [ "S", "D" ],
            [ "T", 2 ], [ "T", 3 ], [ "T", 5 ]
        ],
        [
            [ "T", "Joker" ],
            [ "C", 5 ], [ "C", 6 ], [ "C", "C" ],
            [ "D", 8 ], // -> dog
            [ "H", 8 ], [ "H", 9 ], [ "H", "D" ],
            [ "T", 1 ], [ "T", 10 ], [ "T", 13 ], [ "T", 14 ], [ "T", 15 ], [ "T", 17 ], /* ['T', 19] */ [ "T", 20 ]
        ]
    ] as Card[][]
};

export const test = () => {
    const game = Game.create_new();
    const time = createTimer();
    testingSetShuffler((cards: Card[]) => [..._.concat<Card>([], ...sample_deal.hands), ...sample_deal.dog]);

    game.playerAction({type: 'enter_game', player: 'dxiao', time: time()});
    game.playerAction({type: 'enter_game', player: 'ericb', time: time()});
    game.playerAction({type: 'enter_game', player: 'gcole', time: time()});
    game.playerAction({type: 'enter_game', player: 'karl', time: time()});
    game.playerAction({type: 'enter_game', player: 'samira', time: time()});
    game.playerAction({type: 'message', player: 'dxiao', text: 'does this work?', time: time()});
    game.playerAction({type: 'mark_player_ready', player: 'samira', time: time()});
    game.playerAction({type: 'mark_player_ready', player: 'ericb', time: time()});
    game.playerAction({type: 'mark_player_ready', player: 'gcole', time: time()});
    game.playerAction({type: 'mark_player_ready', player: 'karl', time: time()});
    game.playerAction({type: 'mark_player_ready', player: 'dxiao', time: time()});

    assert.deepStrictEqual(game.getEvents("dxiao").pop()?.type, 'dealt_hand');

    game.playerAction({type: 'bid', player: 'dxiao', bid: BidValue.TEN, time: time()});
    game.playerAction({type: 'bid', player: 'ericb', bid: BidValue.TWENTY, calls: [Call.RUSSIAN], time: time()});
    game.playerAction({type: 'bid', player: 'gcole', bid: BidValue.PASS, time: time()});
    game.playerAction({type: 'bid', player: 'karl', bid: BidValue.PASS, time: time()});
    game.playerAction({type: 'bid', player: 'samira', bid: BidValue.FORTY, time: time()});
    game.playerAction({type: 'bid', player: 'dxiao', bid: BidValue.PASS, time: time()});
    game.playerAction({type: 'bid', player: 'ericb', bid: BidValue.PASS, time: time()});

    assert.deepStrictEqual(game.getEvents('dxiao').pop()?.type, 'bidding_completed');

    game.playerAction({type: 'call_partner', player: 'samira', card: ["H", "R"], time: time()});

    assert.deepStrictEqual(game.getEvents('dxiao').pop()?.type, 'dog_revealed');

    game.playerAction({type: 'ack_dog', player: 'dxiao', time: time()});
    game.playerAction({type: 'ack_dog', player: 'ericb', time: time()});
    game.playerAction({type: 'ack_dog', player: 'gcole', time: time()});
    game.playerAction({type: 'ack_dog', player: 'karl', time: time()});
    game.playerAction({type: 'set_dog', player: 'samira', dog: [['D', 4], ['D', 8], ['H', 4]], private_to: 'samira', time: time()});

    assert.deepStrictEqual(game.getEvents('dxiao').pop()?.type, 'game_started');

    return game;
};
