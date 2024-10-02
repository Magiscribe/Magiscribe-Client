const templateLinearSurvey = {
  nodes: [
    {
      id: '0',
      type: 'start',
      position: {
        x: 0,
        y: 291,
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
        y: 209,
      },
      data: {
        text: 'Welcome to our survey. We appreciate your time in providing feedback.',
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
        y: 0,
      },
      data: {
        type: 'rating-single',
        text: 'How would you rate your overall experience with our product/service?',
        ratings: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent'],
        dynamicGeneration: false,
      },
      measured: {
        width: 384,
        height: 629,
      },
    },
    {
      id: '3',
      type: 'conversation',
      position: {
        x: 1602,
        y: 166,
      },
      data: {
        type: 'open-ended',
        text: 'What aspects of our product/service do you like the most?',
        dynamicGeneration: false,
      },
      measured: {
        width: 384,
        height: 297,
      },
    },
    {
      id: '4',
      type: 'conversation',
      position: {
        x: 2136,
        y: 166,
      },
      data: {
        type: 'open-ended',
        text: 'What areas do you think we could improve?',
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
        x: 2670,
        y: 0,
      },
      data: {
        type: 'rating-multi',
        text: 'Which of the following features do you find most useful? (Select all that apply)',
        ratings: ['Feature A', 'Feature B', 'Feature C', 'Feature D', 'Feature E'],
        dynamicGeneration: false,
      },
      measured: {
        width: 384,
        height: 629,
      },
    },
    {
      id: '6',
      type: 'conversation',
      position: {
        x: 3204,
        y: 0,
      },
      data: {
        type: 'rating-single',
        text: 'How likely are you to recommend our product/service to others?',
        ratings: ['Not at all likely', 'Unlikely', 'Neutral', 'Likely', 'Very likely'],
        dynamicGeneration: false,
      },
      measured: {
        width: 384,
        height: 629,
      },
    },
    {
      id: '7',
      type: 'conversation',
      position: {
        x: 3738,
        y: 166,
      },
      data: {
        type: 'open-ended',
        text: 'Do you have any additional comments or suggestions for us?',
        dynamicGeneration: false,
      },
      measured: {
        width: 384,
        height: 297,
      },
    },
    {
      id: '8',
      type: 'information',
      position: {
        x: 4272,
        y: 197,
      },
      data: {
        text: 'Thank you for completing our survey. Your feedback is valuable and will help us improve our product/service.',
        dynamicGeneration: false,
      },
      measured: {
        width: 384,
        height: 235,
      },
    },
    {
      id: '9',
      type: 'end',
      position: {
        x: 4806,
        y: 291,
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
      id: 'c66cad53-9788-498a-956a-d6025dcf0b68',
      source: '0',
      target: '1',
    },
    {
      id: '4c1d8daa-1b5a-4386-9487-4f176587e8f5',
      source: '1',
      target: '2',
    },
    {
      id: '37f7cba4-0869-4a2b-be89-2b7045109344',
      source: '2',
      target: '3',
    },
    {
      id: '0c109e4f-7e00-40d6-81d5-7a4e547495db',
      source: '3',
      target: '4',
    },
    {
      id: '3a9d71bf-87a9-4e74-a4fc-005a6e5f13d9',
      source: '4',
      target: '5',
    },
    {
      id: '83457dac-21c2-4e1a-9feb-bee7bfa6bb4c',
      source: '5',
      target: '6',
    },
    {
      id: 'b476201b-fd60-450a-b670-d611f2757376',
      source: '6',
      target: '7',
    },
    {
      id: 'cd90f3ab-e2ba-4eef-86ef-8b306f7f6141',
      source: '7',
      target: '8',
    },
    {
      id: 'a13d5822-1f09-4097-b9a5-02557742e7f5',
      source: '8',
      target: '9',
    },
  ],
};

export default templateLinearSurvey;
