export default {
    prerequisite: 'RC2',
    code: 'QW-ACT-R6',
    fluxo: [
        {
            key: '1A',
            title: 'Accessible name describes purpose?',
            answerYes: 'Pass',
            answerNo: 'Fail',
        },
        {
            key: 'Pass',
            title: "The `image button` has an accessible name that describes purpose",
            
        },
        {
            key: 'Fail',
            title: "The \`image button\` has an accessible name that doesn't describe purpose",
        
        }
    ]
}