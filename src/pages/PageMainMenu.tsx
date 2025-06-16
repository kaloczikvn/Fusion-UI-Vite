import React, { useEffect, useRef } from 'react';
import useBaseStore from '../stores/useBaseStore';
import { ActionTypes } from '../constants/ActionTypes';
import { MdOpenInNew } from 'react-icons/md';

const PageMainMenu: React.FC = () => {
    const news = useBaseStore((s) => s.news);
    const fetchNewsIntervalRef = useRef<number | null>(null);

    const disableBlur = () => {
        window.DispatchAction(ActionTypes.SET_BLUR, { blur: false });
    };

    const enableMenu = () => {
        window.DispatchAction(ActionTypes.SET_MENU, { menu: true });
    };

    useEffect(() => {
        const fetchNews = () =>
            new Promise((resolve, reject) => {
                fetch('https://veniceunleashed.net/vu-ig-news')
                    .then((response: any) => {
                        response
                            .json()
                            .then((newsJson: any) => {
                                window.DispatchAction(ActionTypes.SET_NEWS, { news: newsJson });
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
            <div className="main-container">
                <a className="news-item" href={newsLeft.link} onClick={(e) => openNewsLink(newsLeft.link, e)}>
                    <MdOpenInNew />
                    <div className="news-description">
                        <h2>{newsLeft.title}</h2>
                        <h1>{newsLeft.description}</h1>
                    </div>
                </a>
            </div>
            <div className="main-container">
                <a
                    className="news-item secondary"
                    href={newsRight.link}
                    onClick={(e) => openNewsLink(newsRight.link, e)}
                >
                    <MdOpenInNew />
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
