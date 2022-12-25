const dummySponsorshipFunds = [
    {
        reporter_id: '123',
        status: 'ALLOCATED',
        organization: 'WEEF',
        semester: 'Winter 2023',
        proposal_id: '123',
        funding_allocation: 200,
        funding_spent: 70,
        amount_reimbursed: 70,
        proposal_url: 'https://store.steampowered.com/app/945360/Among_Us/',
        presentation_url: 'https://store.steampowered.com/app/945360/Among_Us/',
        claim_deadline: '2022-12-25',
        fi_links: [],
    },
    {
        reporter_id: '1234',
        status: 'CLAIM_SUBMITTED',
        organization: 'MEF',
        semester: 'Winter 2023',
        proposal_id: '1234',
        funding_allocation: 70000,
        funding_spent: 3,
        amount_reimbursed: 0,
        proposal_url: 'https://store.steampowered.com/app/945360/Among_Us/',
        presentation_url: 'https://store.steampowered.com/app/945360/Among_Us/',
        claim_deadline: '2022-12-25',
        fi_links: [],
    },
]

const dummyFundingItems = [
    {
        ppr_links: [],
        upr_links: [],
        name: 'games',
        funding_allocation: 150,
        funding_spent: 50,
        amount_reimbursed: 0,
        purchase_justification: 'We needed this man',
    },
    {
        ppr_links: [],
        upr_links: [],
        name: 'plushies',
        funding_allocation: 100,
        funding_spent: 50,
        amount_reimbursed: 0,
        purchase_justification: 'We needed this too man',
    },
]

const dummyPersonalPurchaseRequests = [
    {
        reporter_id: '123321',
        status: 'SEEKING_APPROVAL',
        name: 'among us game',
        purchase_url: 'https://store.steampowered.com/app/945360/Among_Us/',
        purchase_instructions:
            'Buy Among Us, An online and local party game of teamwork and betrayal for 4-15 players...in space!',
        cost: 5.7,
        purchase_justification: 'Need to find the impostor',
        pickup_instruction: 'Buy it on steam',
        finance_team_approval: true,
        team_captain_approval: true,
        faculty_advisor_approval: true,
        requisition_number: '1234',
        po_number: '1234567',
    },
    {
        reporter_id: '123321',
        status: 'SEEKING_APPROVAL',
        name: 'octupus plushie',
        purchase_url:
            'https://www.amazon.com/Original-Reversible-Octopus-TeeTurtles-Patented/dp/B088X4XFNQ?th=1',
        purchase_instructions: 'click the link and buy it',
        cost: 99.99,
        purchase_justification: 'super cute!',
        pickup_instruction: 'pick up from bay',
        finance_team_approval: false,
        team_captain_approval: false,
        faculty_advisor_approval: false,
        requisition_number: '4321',
        po_number: '7654321',
    },
]

const dummyUWFinancePurchaseRequests = [
    {
        reporter_id: '123321',
        status: 'SEEKING_APPROVAL',
        name: 'fortnite game',
        purchase_url: 'https://www.epicgames.com/fortnite/en-US/home',
        purchase_instructions: 'purchase fortnite',
        cost: 9.99,
        purchase_justification: '#1 Victory Royale!',
        pickup_instruction:
            'IN FORTNITE CHAPTER 3 SEASON 4: PARADISE, A MYSTERIOUS SUBSTANCE HAS APPEARED ON THE ISLAND. CHROME WILL CONSUME ALL, CHROME WILL BE ALL. EMBRACE THE CHROME BY TURNING STRUCTURES CHROME, MAKING YOURSELF CHROME, AND PROVING THE POWER OF CHROME WEAPONS.',
        finance_team_approval: true,
        team_captain_approval: true,
        faculty_advisor_approval: true,
        requisition_number: '12345',
        po_number: '12345678',
    },
    {
        reporter_id: '123321',
        status: 'SEEKING_APPROVAL',
        name: 'cat plush',
        purchase_url:
            'https://www.amazon.com/Stuffed-Plushie-Pillows-Cushion-Decoration/dp/B09BC511YJ/',
        purchase_instructions: 'buy it',
        cost: 99.99,
        purchase_justification: 'cat is cute',
        pickup_instruction: 'Buy online',
        finance_team_approval: false,
        team_captain_approval: false,
        faculty_advisor_approval: false,
        requisition_number: '54321',
        po_number: '87654321',
    },
]

module.exports = {
    dummySponsorshipFunds,
    dummyFundingItems,
    dummyPersonalPurchaseRequests,
    dummyUWFinancePurchaseRequests,
}
