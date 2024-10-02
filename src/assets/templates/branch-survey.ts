import { Edge, Node } from '@xyflow/react';

const templateBranchSurvey: { nodes: Node[]; edges: Edge[] } = {
  nodes: [
    {
      id: '0',
      type: 'start',
      position: {
        x: 0,
        y: 348.5,
      },
      data: {
        text: '',
      },
      measured: {
        width: 384,
        height: 47,
      },
    },
    {
      id: '1',
      type: 'information',
      position: {
        x: 534,
        y: 266.5,
      },
      data: {
        text: 'Welcome to our survey. We value your feedback to help us improve our services.',
        dynamicGeneration: false,
      },
      measured: {
        width: 384,
        height: 211,
      },
    },
    {
      id: '2',
      type: 'conversation',
      position: {
        x: 1068,
        y: 57.5,
      },
      data: {
        type: 'rating-single',
        text: 'How would you rate your overall experience with our service?',
        ratings: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'],
      },
      measured: {
        width: 384,
        height: 629,
      },
    },
    {
      id: '3',
      type: 'condition',
      position: {
        x: 1602,
        y: 300.5,
      },
      data: {
        text: "If the user's rating in node 2 is 'Good' or 'Excellent', route to node 4. Otherwise, route to node 5.",
      },
      measured: {
        width: 384,
        height: 143,
      },
    },
    {
      id: '4',
      type: 'conversation',
      position: {
        x: 2136,
        y: 0,
      },
      data: {
        type: 'open-ended',
        text: 'What aspects of our service did you find most satisfying?',
        dynamicGeneration: false,
      },
      measured: {
        width: 384,
        height: 297,
      },
    },
    {
      id: '5',
      type: 'conversation',
      position: {
        x: 2136,
        y: 447,
      },
      data: {
        type: 'open-ended',
        text: 'What areas do you think we need to improve?',
        dynamicGeneration: false,
      },
      measured: {
        width: 384,
        height: 297,
      },
    },
    {
      id: '6',
      type: 'conversation',
      position: {
        x: 2670,
        y: 57.5,
      },
      data: {
        type: 'rating-multi',
        text: 'Which of the following areas should we focus on improving?',
        ratings: [
          'Customer Service',
          'Product Quality',
          'Website Usability',
          'Delivery Speed',
          'Price Competitiveness',
        ],
      },
      measured: {
        width: 384,
        height: 629,
      },
    },
    {
      id: '7',
      type: 'condition',
      position: {
        x: 3204,
        y: 300.5,
      },
      data: {
        text: "If 'Customer Service' is selected in node 6, route to node 8. Otherwise, route to node 9.",
      },
      measured: {
        width: 384,
        height: 143,
      },
    },
    {
      id: '8',
      type: 'conversation',
      position: {
        x: 3738,
        y: 340.25,
      },
      data: {
        type: 'open-ended',
        text: 'Can you provide specific examples of how we can improve our customer service?',
        dynamicGeneration: false,
      },
      measured: {
        width: 384,
        height: 297,
      },
    },
    {
      id: '9',
      type: 'conversation',
      position: {
        x: 4272,
        y: 223.5,
      },
      data: {
        type: 'open-ended',
        text: 'Do you have any additional comments or suggestions for improvement?',
        dynamicGeneration: false,
      },
      measured: {
        width: 384,
        height: 297,
      },
    },
    {
      id: '10',
      type: 'information',
      position: {
        x: 4806,
        y: 254.5,
      },
      data: {
        text: 'Thank you for taking the time to complete our survey. Your feedback is invaluable in helping us improve our services.',
        dynamicGeneration: false,
      },
      measured: {
        width: 384,
        height: 235,
      },
    },
    {
      id: '11',
      type: 'end',
      position: {
        x: 5340,
        y: 348.5,
      },
      data: {
        text: '',
      },
      measured: {
        width: 384,
        height: 47,
      },
    },
  ],
  edges: [
    {
      id: '788d83dd-ddea-41fe-b42c-7ccdeeb0e79d',
      source: '0',
      target: '1',
    },
    {
      id: '56dac8a9-9eff-4d6d-923a-14a19f6f9193',
      source: '1',
      target: '2',
    },
    {
      id: 'd28e0b52-e463-4481-9aca-3ab4c16ac1b1',
      source: '2',
      target: '3',
    },
    {
      id: '81ee1159-bb52-49e2-8a4b-46d06d09cc2b',
      source: '3',
      target: '4',
    },
    {
      id: '1c5be03b-29c5-4485-b102-0d36c5ba22da',
      source: '3',
      target: '5',
    },
    {
      id: 'dc9ccdbe-c13a-44d7-aa95-cf22cc9a4a01',
      source: '4',
      target: '6',
    },
    {
      id: '39a32a7c-3eb4-46f6-9496-a1c9189736e5',
      source: '5',
      target: '6',
    },
    {
      id: 'a91bab91-53ec-45c4-ac58-d3d117c9d0db',
      source: '6',
      target: '7',
    },
    {
      id: 'd98f3cd3-d080-42dd-a9a3-77af5024e301',
      source: '7',
      target: '8',
    },
    {
      id: '4532cf87-74fe-4561-b1c9-2beeb282e6eb',
      source: '7',
      target: '9',
    },
    {
      id: '33fc5ae6-7ee9-4ae6-9ad5-b67f28faa8b4',
      source: '8',
      target: '9',
    },
    {
      id: '50ba5a7f-e5f9-4f18-9d36-58fe9873c474',
      source: '9',
      target: '10',
    },
    {
      id: '5d7952f0-fb6c-4ffa-ba64-19d463b9b7f1',
      source: '10',
      target: '11',
    },
  ],
};

export default templateBranchSurvey;
