'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import SearchIcon from '@mui/icons-material/Search';

import Grid from '@mui/material/Grid';
import axios from 'axios';
import styles from './page.module.css'; // Import your CSS module

const steps = ['Select Topic', 'Create Session', 'Results'];

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [topics, setTopics] = React.useState([]);
  const [selectedTopic, setSelectedTopic] = React.useState('');
  const [sessionData, setSessionData] = React.useState(null);

  React.useEffect(() => {
    const fetchTopics = async () => {
      const response = await axios.get('/api/topics');
      setTopics(response.data);
    };
    fetchTopics();
  }, []);

  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = async () => {
    console.log("Handling Next. Current Step: ", activeStep);
  
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
  
    if (activeStep === 0 && !sessionData) {
      try {
        console.log("Creating session for topic: ", selectedTopic);
        const response = await axios.post('/api/session', { topic_id: selectedTopic });
        setSessionData(response.data);
        console.log("Session data successfully set: ", response.data);
      } catch (error) {
        console.error("Error creating session: ", error);
      }
    }
  
    // Proceed to the next step
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedTopic('');
    setSessionData(null);
  };

  const handleTopicClick = (topic_id) => {
    setSelectedTopic(topic_id);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Box sx={{ mt: 2, mb: 1 }}>
            {activeStep === 0 && (
              <div>
                <Typography>Select a Topic</Typography>
                <Grid container spacing={4} className={styles.mainGrid}>
                  {topics.map((topic) => (
                    <Grid key={topic._id} item xs={12} sm={6} md={6} lg={6}>
                      <div
                        className={`${styles.topicCard} ${selectedTopic === topic.topic_id ? styles.selected : ''}`}
                        onClick={() => handleTopicClick(topic.topic_id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <h2>{topic.name}</h2>
                        <p>{topic.sub_topics.join(', ')}</p>
                        <div className={styles.arrow}>→</div>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </div>
            )}

            {activeStep === 1 && (
              <div className={styles.mainHolder}>
                {sessionData && (
                  <div className={styles.sessionContainer}>
                    <h2>Session Created</h2>
                    <div className={styles.qrWrapper}>
                      <img src={sessionData.session_qr} alt="Session QR Code" className={styles.qrImage} />
                      <QrCodeScannerIcon className={styles.qrIcon} fontSize="large" />
                    </div>
                    <div className={styles.urlHolder}>
                      <SearchIcon className={styles.searchIcon} />
                      <p className={styles.sessionLink}><a href={sessionData.session_url}>{sessionData.session_url}</a></p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeStep === 2 && (
              <div>
                <Typography>Results</Typography>
                <Typography>Results will be shown here (placeholder for now).</Typography>
              </div>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button
              onClick={handleNext}
              disabled={activeStep === 0 && !selectedTopic}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

