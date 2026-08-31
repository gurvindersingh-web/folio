import React from 'react';
import './ProjectCard.css';
import { FiGithub, FiExternalLink } from 'react-icons/fi';
import BorderGlow from './BorderGlow.jsx';

const ProjectCard = ({ title, description, stack, image, link, reverse }) => {
  return (
    <BorderGlow borderRadius={24} backgroundColor="#121212" className="project-card-glow-wrapper">
      <div className={`project-card ${reverse ? 'project-card--reverse' : ''}`}>
        <div className="project-card__image-container">
          <img src={image} alt={title} className="project-card__image" loading="lazy" />
          <div className="project-card__image-overlay"></div>
        </div>
        
        <div className="project-card__content">
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
    </BorderGlow>
  );
};

export default ProjectCard;
