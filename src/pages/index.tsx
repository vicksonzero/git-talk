import React from 'react';
import { CSSProperties, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap-grid.min.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import '../styles.scss';
import YAML from 'yaml'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { AnchorButton, Breadcrumbs, Button, ButtonGroup, Card, Elevation, IBreadcrumbProps } from '@blueprintjs/core';
import * as styles from './index.module.scss';
import type { Talk } from '../model/Talk';
import ReactMarkdown from 'react-markdown';
import { Graph } from '../components/Graph/Graph';


const useTalkMeta = ([talkData]: [Talk | null]) => {
  const [talkTitle, setTalkTitle] = useState('');
  const [talkDescriptions, setTalkDescriptions] = useState('');
  // const [talkAuthors, setTalkAuthors] = useState<string[]>([]);

  useEffect(() => {
    if (!talkData) return;
    setTalkTitle(talkData.title);
    setTalkDescriptions(talkData.descriptions);
    // setTalkAuthors(talkData.authors);
  }, [talkData]);

  return [talkTitle, talkDescriptions, /* talkAuthors */];
}

type UseTalkSlideReturns = [slideTitle: string, slideDescription: string, breadcrumbData: IBreadcrumbProps[]];
const useTalkSlide = ([talkData, slideId]: [Talk | null, number]): UseTalkSlideReturns => {
  const [slideTitle, setSlideTitle] = useState('');
  const [slideDescription, setSlideDescription] = useState('');
  const [breadcrumbData, setBreadcrumbData] = useState<IBreadcrumbProps[]>([]);

  useEffect(() => {
    if (!talkData) return;
    const slide = talkData.slides[slideId];
    setSlideTitle(slide.title);
    setSlideDescription(slide.descriptions);

    const breadcrumbs: IBreadcrumbProps[] = talkData.slides.map((slide, i) => {
      return { text: slide.title, icon: 'git-branch', current: slideId === i };
    });
    setBreadcrumbData(breadcrumbs);
  }, [talkData, slideId]);

  return [slideTitle, slideDescription, breadcrumbData];
}

type UsePageCounterReturns = [pageId: number, pageCount: number, canGoPrev: boolean, canGoNext: boolean, goPrev: () => void, goNext: () => void];
const usePageCounter = ([talkData]: [Talk | null]): UsePageCounterReturns => {
  const [pageCount, setPageCount] = useState(0);
  const [pageId, setPageId] = useState(0);
  const [canGoPrev, setCanGoPrev] = useState(false);
  const [canGoNext, setCanGoNext] = useState(false);

  useEffect(() => {
    setCanGoPrev(pageId > 0);
    setCanGoNext(pageId < pageCount - 1);
  }, [pageId, pageCount]);

  useEffect(() => {
    if (!talkData) return;
    setPageCount(talkData.slides.length);
    setPageId(0);
  }, [talkData]);

  const goPrev = () => {
    setPageId(pageId - 1);
  };
  const goNext = () => {
    setPageId(pageId + 1);
  };

  return [pageId, pageCount, canGoPrev, canGoNext, goPrev, goNext];
}

// markup
const IndexPage = () => {
  const [talkDataYaml, setTalkDataYaml] = useState('');
  const [talkData, setTalkData] = useState(null);

  useEffect(() => {
    (async () => {
      const user = `vicksonzero`;
      const proj = `e9abc70be9bad406e12d6e9478748086`;
      const file = `git-flow.yml`;
      const content = await (await fetch(`https://gist.githubusercontent.com/${user}/${proj}/raw/${file}`)).text();
      setTalkDataYaml(content);
      const data = YAML.parse(content);
      setTalkData(data);
      console.log(data);
    })();
  }, []);

  const [pageId, pageCount, canGoPrev, canGoNext, goPrev, goNext] = usePageCounter([talkData]);
  const [talkTitle, talkDescription, talkAuthors] = useTalkMeta([talkData]);
  const [slideTitle, slideDescription, breadcrumbData] = useTalkSlide([talkData, pageId]);

  const main = (talkDataYaml === '' ? <h1>Loading...</h1> : (
    <>
      <h1 className="bp3-heading">{talkTitle}<small style={{ fontWeight: 400 }}>by Git-talk</small></h1>
      <ReactMarkdown>{talkDescription}</ReactMarkdown>
      {/* <textarea value={talkDataYaml} cols={100} rows={5}></textarea> */}
      <Breadcrumbs
        items={breadcrumbData}
      />
      <Row>
        <Col>
          <Card elevation={Elevation.TWO} className={styles.leftCard}>
            <Graph />
          </Card>
          <div className={styles.toolbar}>
            <ButtonGroup>
              <Button icon="caret-left" disabled={!canGoPrev} onClick={goPrev}>Prev</Button>
              <Button icon="repeat">Replay</Button>
              <Button icon="edit">Edit</Button>
              <Button rightIcon="caret-right" disabled={!canGoNext} onClick={goNext}>Next</Button>
            </ButtonGroup>
          </div>
        </Col>
        <Col>
          <h2 className="bp3-heading">{slideTitle}</h2>
          <ReactMarkdown>{slideDescription}</ReactMarkdown>
        </Col>
      </Row>
      <div className={styles.footer}>
        <p>Git-talk unites all git workflow discussions. It is a project by <a href="https://dickson.md">Dickson Chui</a></p>
        <p><a href="https://github.com/vicksonzero/git-talk">Fork me on GitHub!</a></p>
      </div>
    </>
  ));

  return (
    <Container>
      <title>Git-talk</title>
      {main}
    </Container>
  );
}

export default IndexPage
