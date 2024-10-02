import { Edge, Node } from '@xyflow/react';

const templateOpenEnded: { nodes: Node[]; edges: Edge[] } = {
  nodes: [
    {
      id: '0',
      type: 'start',
      position: {
        x: -208.72677849756943,
        y: 2051.090185213084,
      },
      data: {},
      measured: {
        width: 384,
        height: 48,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'a0ic',
      type: 'information',
      position: {
        x: 534,
        y: 1901,
      },
      data: {
        text: 'Magiscribe’s Inquiries fuse the scalability of surveys with the insight quality of an interview. We are looking for your feedback on how best to improve this user interface and find product market fit where this type of technology would be most helpful. ',
      },
      measured: {
        width: 384,
        height: 332,
      },
      selected: false,
      dragging: false,
    },
    {
      id: '6zb7',
      type: 'conversation',
      position: {
        x: 2670,
        y: 0,
      },
      data: {
        text: 'Task: Ask the user a follow up question about this user interface. \n\nUser Interface:  It is currently a chat interface. The conversation can contain open ended questions and rating scale questions that can either be single or multi select. Questions can either be pre-written or dynamically generated. We want to know what we could do to make this experience better. You can ask somewhat meta questions about how this particular experience could be improved. Currently while the user is waiting for a response there is an animation of moving dots to indicate typing.',
        dynamicGeneration: true,
      },
      measured: {
        width: 384,
        height: 633,
      },
      selected: false,
    },
    {
      id: 'ssm1',
      type: 'condition',
      position: {
        x: 2136,
        y: 1647,
      },
      data: {
        text: 'Go to node "fht6" if the user asks a question AND the User is the most recent message in the conversation. Both conditions must be met.\n\nGo to node "6zb7" else if the user makes a statement about the User Interface OR (if the most recent message was from the bot AND the statement relates to user interfaces.)\n\nGo to node "ylz7" else if the user makes a statement about Product Market Fit OR (if the most recent message was from the bot AND the statement relates to product market fit.)\n\nGo to node "98ke" if the user says something unrelated to Magiscribe\'s User Interface or our Product Market Fit AND if the User has the most recent message. If and only if both conditions are met, this instruction takes precedence over other options. \n\nGo to node "aryg" if the user indicates that want to be done or are finished giving feedback.\n\nCRITICAL: AVOID A DOOM LOOP. If the most recent message is from the BOT go to either "6zb7" or "ylz7"',
      },
      measured: {
        width: 384,
        height: 840,
      },
      selected: false,
    },
    {
      id: 'fht6',
      type: 'information',
      position: {
        x: 2670,
        y: 783,
      },
      data: {
        text: "Task: Answer the user's question using the following information. \n\nUser Interface: Internally there exists a graph builder that can be configured to ask certain questions or dynamically generate others. Conditions can be used for intelligent routing through the conversation. We are considering adding more multimodal inputs such as voice, graphs, a whiteboard, or games for input. \n\nProduct Market Fit: This technology is meant for leaders who are responsible for a large group of people, desire getting input from that group, but the group is too large to talk to everyone individually. Here are some examples we've thought of internally. \nUser base of your product/service (Business Owners)\nWorkforce/Shareholders of your company (Business owners)\nAudience of your content (Internet content creators)\nConstituents you represent (Politicians, labor unions, school boards)\nMembers of your social organization (Leaders of Fraternities, Clubs, Sports Leagues, etc.)\nDonors to your cause (Non Profits)\nDAOs you are a part of (Cryptocurrency holders)\nClass action lawsuits you are a plaintiff in (Legal Firms)",
        dynamicGeneration: true,
      },
      measured: {
        width: 384,
        height: 1004,
      },
      selected: false,
    },
    {
      id: 'ggjq',
      type: 'conversation',
      position: {
        x: 1602,
        y: 1790.5,
      },
      data: {
        text: 'Which are you more interested in discussing? Feel free to add any additional information to shape the direction of this inquiry. At any point in the conversation you ask to switch to the other topic. ',
        type: 'rating-single',
        ratings: ['User Interface', 'Product Market Fit'],
      },
      measured: {
        width: 384,
        height: 553,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'gd47',
      type: 'information',
      position: {
        x: 1068,
        y: 1925,
      },
      data: {
        text: 'In this inquiry you can both respond to questions and ask your own. You can also finish the inquiry at any time by saying something to the effect of, "I\'m done giving feedback".',
      },
      measured: {
        width: 384,
        height: 284,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'aryg',
      type: 'information',
      position: {
        x: 2670,
        y: 1937,
      },
      data: {
        text: 'Generate a summary of everything that has been discussed throughout the duration of this inquiry. Thank the user for their time and valuable input.',
        dynamicGeneration: true,
      },
      measured: {
        width: 384,
        height: 260,
      },
      selected: false,
      dragging: false,
    },
    {
      id: '45b3',
      type: 'end',
      position: {
        x: 3254.159148321121,
        y: 2037.2639259147663,
      },
      data: {
        text: '',
      },
      measured: {
        width: 384,
        height: 48,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'ylz7',
      type: 'conversation',
      position: {
        x: 2670,
        y: 2347,
      },
      data: {
        text: 'Task: Ask the user a follow up question about product market fit. \n\nProduct Market Fit: This technology is meant for leaders who are responsible for a large group of people, desire getting input from that group, but the group is too large to talk to everyone individually. Figure out if the user responding to this inquiry is in such a position personally, or if they can think of relevant scenarios for this tech. ',
        dynamicGeneration: true,
      },
      measured: {
        width: 384,
        height: 537,
      },
      selected: false,
    },
    {
      id: '98ke',
      type: 'information',
      position: {
        x: 2670,
        y: 3034,
      },
      data: {
        text: "Note: If the user makes a remark unrelated to Magiscribe then kindly remind them that  this is a focused inquiry meant to uncover their perspective on Magiscribe's current user interface and product market fit ideas.",
        dynamicGeneration: true,
      },
      measured: {
        width: 384,
        height: 308,
      },
      selected: false,
    },
  ],
  edges: [
    {
      id: '250b4312-1bc7-42b4-9d04-6aa43305deaf',
      source: '0',
      target: 'a0ic',
    },
    {
      id: '60ed488c-9ed8-4fbe-8704-3cf4389e41ad',
      source: '6zb7',
      target: 'ssm1',
    },
    {
      id: '78e5ede4-2d3a-4b18-a445-3acf50cf3550',
      source: 'ssm1',
      target: '6zb7',
    },
    {
      id: '4800bcfd-a0a3-4c98-b663-364b7e5deddf',
      source: 'ssm1',
      target: 'fht6',
    },
    {
      id: 'a8192094-64e0-4ecb-9f5b-151454b5ef7d',
      source: 'ggjq',
      target: 'ssm1',
    },
    {
      id: '723e989a-cab6-4767-892c-13e28d3228b1',
      source: 'a0ic',
      target: 'gd47',
    },
    {
      id: '01278b33-c311-4b80-817f-231a633954d2',
      source: 'gd47',
      target: 'ggjq',
    },
    {
      id: '75337eb1-e8ac-4e34-8bca-7dd66fcf8545',
      source: 'ssm1',
      target: 'aryg',
    },
    {
      id: 'dea197f6-3592-468b-a4fa-2de07f54a179',
      source: 'aryg',
      target: '45b3',
    },
    {
      id: '5acb20b4-7199-42b8-b89e-a1706cfcaa10',
      source: 'fht6',
      target: 'ssm1',
    },
    {
      id: '0484eec3-8c59-41e7-aa87-9976c0abbff6',
      source: 'ssm1',
      target: 'ylz7',
    },
    {
      id: 'c5f8f7b0-ae30-472e-80fd-ec5bc2aed313',
      source: 'ylz7',
      target: 'ssm1',
    },
    {
      id: '94b3f5b5-799a-4a95-8fe7-de1cf0affd58',
      source: 'ssm1',
      target: '98ke',
    },
    {
      id: 'c1bc4777-c6d6-4e9d-b871-cf17e6c2e387',
      source: '98ke',
      target: 'ssm1',
    },
  ],
};

export default templateOpenEnded;
