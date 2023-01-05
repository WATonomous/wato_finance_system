import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Text, Box } from '@chakra-ui/react'
const TreeView = (props) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { tickets } = props
    const [tree, setTree] = useState([])
    const pathname = location.pathname.substring(1).split('/')
    const ticketType = pathname[0]
    const ticketID = parseInt(pathname[1])

    const sortAndTypeTickets = (list, type) => {
        let newArrayWithType = list.map((obj) => ({ ...obj, type: type }))
        let sortedArr = newArrayWithType.sort((a, b) =>
            a.name > b.name ? 1 : -1
        )
        return sortedArr
    }

    let { SF, FI, PPR, UPR } = tickets

    if (SF.length !== 0) {
        SF = sortAndTypeTickets(SF, 'SF')
        FI = sortAndTypeTickets(FI, 'FI')
        PPR = sortAndTypeTickets(PPR, 'PPR')
        UPR = sortAndTypeTickets(UPR, 'UPR')
    }

    useEffect(() => {
        if (SF.length !== 0) {
            let id = ticketID
            if (ticketType === 'FI') {
                //use SF_link to get SF
                let result = FI.find((ticket) => ticket._id === ticketID)
                id = result.sf_link
            } else if (ticketType === 'PPR') {
                //trace link to FI and then to SF
                let result = PPR.find((ticket) => ticket._id === ticketID)
                const FI_ID = result.fi_link
                result = FI.find((ticket) => ticket._id === FI_ID)
                id = result.sf_link
            } else if (ticketType === 'UPR') {
                let result = UPR.find((ticket) => ticket._id === ticketID)
                const FI_ID = result.fi_link
                result = FI.find((ticket) => ticket._id === FI_ID)
                id = result.sf_link
            }
            setTreeFromSF(id)
            //search FIs to find if they have ticketID, return a list of FIs
            //for each FIs, search PPR and UPR if they have have that FI, return list of PPR and a list of UPR
        }
    }, [tickets, location])

    const setTreeFromSF = (sf_id) => {
        let FI_arr = []
        FI.forEach((fi) => {
            if (fi.sf_link === sf_id) {
                FI_arr.push(fi)
            }
        })
        let fi_dict = Object.fromEntries(FI_arr.map((fi) => [fi._id, [[], []]])) //first arr holds PPR and second arr holds UPR
        PPR.forEach((ppr) => {
            if (ppr.fi_link in fi_dict) {
                fi_dict[ppr.fi_link][0].push(ppr)
            }
        })
        UPR.forEach((upr) => {
            if (upr.fi_link in fi_dict) {
                fi_dict[upr.fi_link][1].push(upr)
            }
        })

        let treeArr = [SF.find((ticket) => ticket._id === sf_id)]
        let subTreeArr = []
        Object.entries(fi_dict).forEach(([key, val]) => {
            let fi = FI.find((ticket) => ticket._id === parseInt(key))
            subTreeArr.push(fi)
            subTreeArr.push(val)
        })
        treeArr.push(subTreeArr)
        setTree(treeArr)
    }

    return (
        <Box
            pos="fixed"
            bottom="0"
            right="0"
            width="300px"
            border="1px"
            borderColor="gray.200"
            height="auto"
        >
            {location.pathname !== '/' && (
                <Box padding="24px" width="250px">
                    {tree[0] !== undefined &&
                        tree.map((root1, i) => {
                            if (Array.isArray(root1)) {
                                return root1.map((root2, j) => {
                                    if (Array.isArray(root2)) {
                                        return root2.map((root3, k) => {
                                            return root3.map((root4, l) => {
                                                let bold = false
                                                if (
                                                    ticketType === root4.type &&
                                                    ticketID === root4._id
                                                ) {
                                                    bold = true
                                                }
                                                return (
                                                    <Box
                                                        key={[i, j, k, l]}
                                                        pos="relative"
                                                        left="8"
                                                        border="1px"
                                                        borderColor="gray.200"
                                                        borderRadius="4"
                                                        cursor="pointer"
                                                        bgColor={
                                                            k === 0
                                                                ? '#22f5a1'
                                                                : '#ff87f3'
                                                        }
                                                    >
                                                        <Text
                                                            as={bold ? 'b' : ''}
                                                            fontSize="xs"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/${root4.type}/${root4._id}`
                                                                )
                                                            }
                                                        >
                                                            {root4.name}
                                                        </Text>
                                                    </Box>
                                                )
                                            })
                                        })
                                    } else {
                                        let bold = false
                                        if (
                                            ticketType === root2.type &&
                                            ticketID === root2._id
                                        ) {
                                            bold = true
                                        }
                                        return (
                                            <Box
                                                key={[i, j]}
                                                pos="relative"
                                                left="4"
                                                bgColor="#34cceb"
                                                cursor="pointer"
                                            >
                                                <Text
                                                    as={bold ? 'b' : ''}
                                                    fontSize="xs"
                                                    onClick={() =>
                                                        navigate(
                                                            `/${root2.type}/${root2._id}`
                                                        )
                                                    }
                                                >
                                                    {root2.name}
                                                </Text>
                                            </Box>
                                        )
                                    }
                                })
                            } else {
                                let bold = false
                                if (
                                    ticketType === root1.type &&
                                    ticketID === root1._id
                                ) {
                                    bold = true
                                }
                                return (
                                    <Box
                                        key={i}
                                        bgColor="tomato"
                                        cursor="pointer"
                                    >
                                        <Text
                                            as={bold ? 'b' : ''}
                                            fontSize="xs"
                                            onClick={() =>
                                                navigate(
                                                    `/${root1.type}/${root1._id}`
                                                )
                                            }
                                        >
                                            {root1.name}
                                        </Text>
                                    </Box>
                                )
                            }
                        })}
                </Box>
            )}
        </Box>
    )
}

export default TreeView
