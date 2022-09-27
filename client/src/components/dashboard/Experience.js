import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { deleteExperience } from '../../actions/profile';

const Experience = ({ experience, deleteExperience }) => {
    const experiences = experience.map(exp => (
        <tr key={exp._id}>
            <td>{exp.company}</td>
            <td>{exp.title}</td>
            <td className='hide-sm'>
                <Moment format='DD/MM/YYYY'>{exp.from}</Moment> -{' '}
                {exp.to === null ? (
                    ' Now'
                ) : (
                    <Moment format='DD/MM/YYYY'>{exp.to}</Moment>
                )}
            </td>
            <td>
                <button
                    className='btn btn-danger'
                    onClick={() => deleteExperience(exp._id)}
                >
                    Delete
                </button>
            </td>
        </tr>
    ));

    return (
        <Fragment>
            <h2 className='my-2'>Experience Credentials</h2>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Company</th>
                        <th>Title</th>
                        <th className='hide-sm'>Years</th>
                        <th className='hide-sm'> </th>
                    </tr>
                </thead>
                <tbody>{experiences}</tbody>
            </table>
        </Fragment>
    );
};

Experience.propTypes = {
    experience: PropTypes.array.isRequired,
    deleteExperience: PropTypes.func.isRequired,
};

export default connect(null, { deleteExperience })(Experience);
