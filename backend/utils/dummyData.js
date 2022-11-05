// SF = sponsorship fund
// FI = funding item
// PPR = personal purchase request
// UPR = UW finance purchase request
const mongoose = require('mongoose')

const SF1 = {
    _id: mongoose.Types.ObjectId(1),
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
}

const SF2 = {
    _id: mongoose.Types.ObjectId(2),
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
}

const FI1 = {
    sf_link: mongoose.Types.ObjectId(1),
    ppr_links: [],
    upr_links: [],
    funding_allocation: 150,
    funding_spent: 50,
    amount_reimbursed: 0,
    purchase_justification: 'We needed this man',
}

const FI2 = {
    sf_link: mongoose.Types.ObjectId(2),
    ppr_links: [],
    upr_links: [],
    funding_allocation: 150,
    funding_spent: 50,
    amount_reimbursed: 0,
    purchase_justification: 'We needed this too man',
}

const PPR1 = {
    reporter_id: '123321',
    status: 'SEEKING_APPROVAL',
    fi_link: mongoose.Types.ObjectId(1),
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
}

const PPR2 = {
    reporter_id: '123321',
    status: 'SEEKING_APPROVAL',
    fi_link: mongoose.Types.ObjectId(2),
    purchase_url:
        'https://innersloth.itch.io/among-us/devlog/171026/among-us-2',
    purchase_instructions:
        'An online and local party game of teamwork and betrayal for 4-15 players...in space!',
    cost: 99.99,
    purchase_justification: 'Need to find the impostor again!',
    pickup_instruction: 'Wait for amongus 2 to come out, then buy it',
    finance_team_approval: false,
    team_captain_approval: false,
    faculty_advisor_approval: false,
    requisition_number: '4321',
    po_number: '7654321',
}

const UPR1 = {
    reporter_id: '123321',
    status: 'SEEKING_APPROVAL',
    fi_link: mongoose.Types.ObjectId(1),
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
}

const UPR2 = {
    reporter_id: '123321',
    status: 'SEEKING_APPROVAL',
    fi_link: mongoose.Types.ObjectId(2),
    purchase_url: 'https://store.epicgames.com/en-US/p/fortnite--1000-v-bucks',
    purchase_instructions: 'BUY VBUCKS',
    cost: 99.99,
    purchase_justification: 'I need battlepass',
    pickup_instruction: 'Buy online',
    finance_team_approval: false,
    team_captain_approval: false,
    faculty_advisor_approval: false,
    requisition_number: '54321',
    po_number: '87654321',
}

module.exports = { SF1, SF2, FI1, FI2, PPR1, PPR2, UPR1, UPR2 }
