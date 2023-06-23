import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import './index.less'
import {
    applications
} from './applications'
const applicationTabs = ['全部', '效率', '营销', '创作', '图表', '专家', '娱乐', '企业', '电脑应用']
import useAuthStore from '../../store/authStore'



function ApplicationPage() {
    const token = useAuthStore((state) => state.token)
    const setShowLoginModal = useAuthStore((state) => state.setShowLoginModal)
    const navigate = useNavigate();
    const [currentApplicationTab, setCurrentApplicationTab] = useState('全部')

    const filterApplications = applications.filter(item => {
        if (currentApplicationTab == '全部') {
            return true
        } else {
            return item.key == currentApplicationTab
        }
    })

    return <div className='application-page'>
        <div className='application-left-tabBar-mobile'>
            {
                applicationTabs.map((item) => {
                    return <div key={item}
                        onClick={() => {
                            if(item == '创作') {
                                navigate('/creation')
                            }else {
                                setCurrentApplicationTab(item)
                            }
                        }}
                        className={
                            currentApplicationTab == item ? 'application-left-tabBar-mobile-item_active' : 'application-left-tabBar-mobile-item'
                        }
                    >
                        <div className='tabBar-active-line' />
                        {item}
                    </div>
                })
            }
            {/* <div className='application-left-tabBar-mobile-item_active'>
                <div className='tabBar-active-line'></div>
                全部
            </div> */}

        </div>
        <div className='application-left-tabBar'>
            {applicationTabs.map(item => {
                return <div key={item}
                    onClick={() => {
                        if(item == '创作') {
                            navigate('/creation')
                        }else {
                            setCurrentApplicationTab(item)
                        }
                    }}
                    className={currentApplicationTab == item ? 'application-left-tabBar-item_active' : 'application-left-tabBar-item'}>
                    {item}
                </div>
            })}
        </div>
        <div className='application-right'>
            <div className='application-right-content'>
                {
                    currentApplicationTab != '全部' && <div>
                        <div className='application-title'>{currentApplicationTab}</div>
                        <div className='application-list'>
                        {
                            filterApplications.map(item => {
                                return <div
                                    key={item.name}
                                    onClick={() => {
                                        if(!token) {
                                            setShowLoginModal(true)
                                            return
                                        }
                                        window._czc.push(["_trackEvent", '应用列表页面', '点击应用', item.name, 1]);
                                        navigate(item.link);
                                    }}
                                    className='application-list-item'>
                                    <img className='application-list-item-pic' src={item.pic} />
                                    <div className='application-list-item-name'>{item.name}</div>
                                    <div className='application-list-item-dec'>{item.dec}</div>
                                </div>
                            })
                        }
                        </div>
                    </div>
                }
                {
                    currentApplicationTab == '全部' && applicationTabs.map(key => {
                        
                        return key != "全部" && <div key={key}>
                            <div className='application-title'>{key}</div>
                            <div className='application-list'>
                                {
                                    filterApplications.filter(data=>data.key == key).map(item => {
                                        return <div
                                            key={item.name}
                                            onClick={() => {
                                                if(!token) {
                                                    setShowLoginModal(true)
                                                    return
                                                }
                                                navigate(item.link);
                                            }}
                                            className='application-list-item'>
                                            <img className='application-list-item-pic' src={item.pic} />
                                            <div className='application-list-item-name'>{item.name}</div>
                                            <div className='application-list-item-dec'>{item.dec}</div>
                                        </div>
                                    })
                                }

                            </div>
                        </div>
                    })
                }


            </div>
        </div>
    </div>
}

export default ApplicationPage