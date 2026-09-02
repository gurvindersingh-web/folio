import React from 'react';
import './ProjectCard.css';
import { FiGithub, FiExternalLink } from 'react-icons/fi';

const ProjectCard = ({ title, description, stack, image, link, reverse, index = 1 }) => {
  return (
      <div className={`project-card ${reverse ? 'project-card--reverse' : ''}`}>
        <div className="project-card__image-container">
          <img src={image} alt={title} className="project-card__image" loading="lazy" />
          <div className="project-card__image-overlay"></div>
        </div>
        
        <div style={{ display: 'flex', gap: '3vw', alignItems: 'flex-start', flex: 1 }}>
          <div className="r-about-eyebrow" style={{ marginTop: '0.8rem', marginRight: '0' }}>
            <span className="r-about-eyebrow-text">{`PROJECT ${String(index).padStart(2, '0')}`}</span>
            <span className="r-about-eyebrow-icon">水</span>
          </div>
          
          <div className="project-card__content" style={{ flex: 'unset' }}>
          <h3 className="project-card__title">{title}</h3>
          <p className="project-card__description">{description}</p>
          
          <div className="project-card__stack">
            {stack.map((tech, index) => (
              <span key={index} className="project-card__stack-item">{tech}</span>
            ))}
          </div>
          
          <div className="project-card__links">
            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer" className="project-card__link">
                <FiGithub size={20} />
                <span>Source Code</span>
              </a>
            )}
          </div>
          </div>
        </div>
      </div>
  );
};

export default ProjectCard;
