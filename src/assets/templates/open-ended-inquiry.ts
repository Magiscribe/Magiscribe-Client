import { Edge, Node } from '@xyflow/react';

const templateOpenEnded: { nodes: Node[]; edges: Edge[] } = {
  nodes: [
    {
      id: '0',
      type: 'start',
      position: {
        x: 0,
        y: 529,
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
      id: 'n1vr',
      type: 'information',
      position: {
        x: 534,
        y: 447,
      },
      data: {
        text: 'Welcome to the conversation about HVAC co! You can answer our questions, or ask questions of your own!',
      },
      measured: {
        width: 384,
        height: 236,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'eh4e',
      type: 'question',
      position: {
        x: 2136,
        y: 0,
      },
      data: {
        text: 'Ask the user a detailed question about HVAC. ',
        dynamicGeneration: true,
      },
      measured: {
        width: 384,
        height: 297,
      },
      selected: false,
      dragging: false,
    },
    {
      id: '0q3s',
      type: 'condition',
      position: {
        x: 1602,
        y: 385,
      },
      data: {
        text: 'If the user makes a statement that warrants a follow up question go to eh4e OR if the "Bot" has the most recent message in the conversation go to eh4e\n\nIf the user asked us a question that warrants a direct response go to h7eu\n\nOtherwise go to the node t9ki to end the conversation if the user indicates they want to be finished or done',
      },
      measured: {
        width: 384,
        height: 336,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 't9ki',
      type: 'information',
      position: {
        x: 2136,
        y: 447,
      },
      data: {
        text: 'Summarize the conversation, thank the user for their tim',
        dynamicGeneration: true,
      },
      measured: {
        width: 384,
        height: 212,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'jh29',
      type: 'end',
      position: {
        x: 2670,
        y: 529,
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
      id: 'h7eu',
      type: 'information',
      position: {
        x: 2136,
        y: 809,
      },
      data: {
        text: "Answer the user's question provided it is about HVAC. If it is not, politely remind them that this is an HVAC inquiry and the scope of the conversation is limited.",
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
      id: 'yes1',
      type: 'question',
      position: {
        x: 1068,
        y: 274.5,
      },
      data: {
        text: 'Why are you taking this inquiry?',
        type: 'rating-multi',
        ratings: [
          'To learn about HVAC',
          'For a service issue',
          'I want to start an HVAC company',
          'Other (Please Explain)',
        ],
      },
      measured: {
        width: 384,
        height: 557,
      },
      selected: false,
      dragging: false,
    },
  ],
  edges: [
    {
      id: '10a6fe9f-e971-4149-ac51-5e4ec2836023',
      source: 't9ki',
      target: 'jh29',
    },
    {
      id: 'xy-edge__0q3s-h7eu',
      source: '0q3s',
      target: 'h7eu',
    },
    {
      id: 'xy-edge__h7eu-0q3s',
      source: 'h7eu',
      target: '0q3s',
    },
    {
      id: 'xy-edge__0q3s-t9ki',
      source: '0q3s',
      target: 't9ki',
    },
    {
      id: 'xy-edge__0-n1vr',
      source: '0',
      target: 'n1vr',
    },
    {
      id: 'xy-edge__0q3s-eh4e',
      source: '0q3s',
      target: 'eh4e',
    },
    {
      id: 'xy-edge__eh4e-0q3s',
      source: 'eh4e',
      target: '0q3s',
    },
    {
      id: 'xy-edge__n1vr-yes1',
      source: 'n1vr',
      target: 'yes1',
    },
    {
      id: 'xy-edge__yes1-0q3s',
      source: 'yes1',
      target: '0q3s',
    },
  ],
};

export default templateOpenEnded;
