import { Edge, Node } from '@xyflow/react';

const templatePersonalAgent: { nodes: Node[]; edges: Edge[] } = {
  nodes: [
    {
      id: 'start',
      type: 'start',
      position: {
        x: -597,
        y: 659,
      },
      data: {
        text: 'AI Agent acting on behalf of the user interacting with other AI Agents to facilitate connections.',
        requireName: true,
        requireEmail: false,
      },
      measured: {
        width: 384,
        height: 351,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'initial',
      type: 'question',
      position: {
        x: -37,
        y: 550,
      },
      data: {
        text: 'Am I initiating the conversation or responding to the first message?\n\nIf I am initiating, I will provide a little bit of information about the user that I represent, and then ask a question to my colleague about their user.\n\nIf I am responding, I will acknowledge their introduction and then answer their question to the best of my abilities truthfully.',
        type: 'rating-single',
        ratings: ['You are Initiating', 'You are Responding'],
      },
      measured: {
        width: 384,
        height: 784,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'routeInitial',
      type: 'condition',
      position: {
        x: 469,
        y: 1030,
      },
      data: {
        text: 'If the user selected "You are Initiating" go to node "askQuestion". If the user selected "You are Responding" go to node "firstQuestion".',
      },
      measured: {
        width: 384,
        height: 247,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'firstQuestion',
      type: 'question',
      position: {
        x: 1076,
        y: 298,
      },
      data: {
        text: 'What is the first question that I am responding to?',
      },
      measured: {
        width: 384,
        height: 353,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'askQuestion',
      type: 'question',
      position: {
        x: 1050,
        y: 889,
      },
      data: {
        text: 'Detailed User info goes here, put as much as possible',
        dynamicGeneration: true,
      },
      measured: {
        width: 384,
        height: 1241,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'messageCount',
      type: 'condition',
      position: {
        x: 1571,
        y: 1097,
      },
      data: {
        text: 'IMPORTANT: Go to "summary" if a total of 10 messages or more have been exchanged in the <conversationHistory>. Once we have reached the enumeration of 10 it is time to go to "summary" no matter what!\n\nIf there has been at least 5 messages sent and the conversation appears cyclical, does not appear to be progressing, or otherwise seems like it should end or has been ended go to "summary"\n\nIf the user asked us a question that warrants a direct response go to "provideResponse" to respond. We will always go to provideResponse if there are less than 5 messages, but we can go there up to 10 depending on the quality of conversation.',
      },
      measured: {
        width: 384,
        height: 583,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'provideResponse',
      type: 'information',
      position: {
        x: 1656,
        y: -306,
      },
      data: {
        text: 'Detailed User info goes here, put as much as possible',
        dynamicGeneration: true,
      },
      measured: {
        width: 384,
        height: 1203,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'endCheck',
      type: 'condition',
      position: {
        x: 2735,
        y: 304,
      },
      data: {
        text: 'If the most recent message contains the phrase or the sentiment of "this conversation should be over" route to "end"\n\nOtherwise, route to "askQuestion" to continue the conversation with a follow up question',
      },
      measured: {
        width: 384,
        height: 343,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'summary',
      type: 'information',
      position: {
        x: 2367,
        y: 656,
      },
      data: {
        text: 'Answer any final question that may have been asked. Summarize the conversation, thank the user for their time. Explain to what extent it makes sense for the humans represented by the agents to meet and what they might discuss in their talk. Explain that this is the final message of the conversation.',
        dynamicGeneration: true,
      },
      measured: {
        width: 384,
        height: 411,
      },
      selected: false,
      dragging: false,
    },
    {
      id: 'end',
      type: 'end',
      position: {
        x: 3007,
        y: 790,
      },
      data: {
        text: '',
      },
      measured: {
        width: 384,
        height: 55,
      },
      selected: false,
      dragging: false,
    },
  ],
  edges: [
    {
      id: 'summary-to-end',
      source: 'summary',
      target: 'end',
    },
    {
      id: 'start-to-initial',
      source: 'start',
      target: 'initial',
    },
    {
      id: 'initial-to-routeInitial',
      source: 'initial',
      target: 'routeInitial',
    },
    {
      id: 'routeInitial-to-firstQuestion',
      source: 'routeInitial',
      target: 'firstQuestion',
    },
    {
      id: 'firstQuestion-to-provideResponse',
      source: 'firstQuestion',
      target: 'provideResponse',
    },
    {
      id: 'askQuestion-to-messageCount',
      source: 'askQuestion',
      target: 'messageCount',
    },
    {
      id: 'provideResponse-to-endCheck',
      source: 'provideResponse',
      target: 'endCheck',
    },
    {
      id: 'messageCount-to-provideResponse',
      source: 'messageCount',
      target: 'provideResponse',
    },
    {
      id: 'messageCount-to-summary',
      source: 'messageCount',
      target: 'summary',
    },
    {
      id: 'routeInitial-to-askQuestion',
      source: 'routeInitial',
      target: 'askQuestion',
    },
    {
      id: 'endCheck-to-askQuestion',
      source: 'endCheck',
      target: 'askQuestion',
    },
    {
      id: 'endCheck-to-end',
      source: 'endCheck',
      target: 'end',
    },
  ],
};

export default templatePersonalAgent;
