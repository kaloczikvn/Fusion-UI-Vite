import React, { useEffect, useRef } from 'react';
import useBaseStore from '../stores/useBaseStore';
import { SET_BLUR, SET_MENU, SET_NEWS } from '../constants/ActionTypes';

const PageMainMenu: React.FC = () => {
    const news = useBaseStore((s) => s.news);
    const fetchNewsIntervalRef = useRef<number | null>(null);

    const disableBlur = () => {
        window.DispatchAction(SET_BLUR, { blur: false });
    };

    const enableMenu = () => {
        window.DispatchAction(SET_MENU, { menu: true });
    };

    useEffect(() => {
        const fetchNews = () =>
            new Promise((resolve, reject) => {
                fetch('https://veniceunleashed.net/vu-ig-news')
                    .then((response: any) => {
                        response
                            .json()
                            .then((newsJson: any) => {
                                window.DispatchAction(SET_NEWS, { news: newsJson });
                                resolve(newsJson);
                            })
                            .catch((err: any) => {
                                reject(err);
                            });
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });

        disableBlur();
        enableMenu();

        fetchNews();
        fetchNewsIntervalRef.current = setInterval(fetchNews, 30 * 60 * 1000);

        return () => {
            if (fetchNewsIntervalRef.current) {
                clearInterval(fetchNewsIntervalRef.current);
                fetchNewsIntervalRef.current = null;
            }
        };
    }, []);

    const openNewsLink = (link: string, e: any) => {
        if (e) {
            e.preventDefault();
        }

        if (link === '#') {
            return;
        }

        window.WebUI.Call('OpenLink', link);
    };

    /*
    const onQuit = (e: any) => {
        if (e) e.preventDefault();

        window.WebUI.Call('Quit');
    };
    */

    let newsLeft = {
        title: 'Please wait',
        description: 'Fetching latest news...',
        link: '#',
    };

    let newsRight = {
        title: 'Please wait',
        description: 'Fetching latest news...',
        link: '#',
    };

    if (news !== null) {
        newsLeft = news.newsLeft;
        newsRight = news.newsRight;
    }

    return (
        <div className="main-menu content-wrapper">
            <div className="main-container left">
                <a className="news-item" href={newsLeft.link} onClick={(e) => openNewsLink(newsLeft.link, e)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="86px"
                        width="86px"
                        viewBox="0 -960 960 960"
                        fill="#e8eaed"
                    >
                        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
                    </svg>
                    <div className="news-description">
                        <h2>{newsLeft.title}</h2>
                        <h1>{newsLeft.description}</h1>
                    </div>
                </a>
            </div>
            <div className="main-container right">
                <a
                    className="news-item secondary"
                    href={newsRight.link}
                    onClick={(e) => openNewsLink(newsRight.link, e)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="86px"
                        width="86px"
                        viewBox="0 -960 960 960"
                        fill="#e8eaed"
                    >
                        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
                    </svg>
                    <div className="news-description">
                        <h2>{newsRight.title}</h2>
                        <h1>{newsRight.description}</h1>
                    </div>
                </a>
            </div>
        </div>
    );
};
export default PageMainMenu;
